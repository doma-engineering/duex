// TODO: test cross platform support
// WARNING: https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
// TODO: test large amount of files
// TODO: test error handling
// TODO: test file name correctness with different selection types
//       (only folder, only files, files and folders, etc.)

var inputFilesEl = document.getElementById('__input_files')
var inputFolderEl = document.getElementById('__input_folder')
var dropzoneEl = document.getElementById('__dropzone')
var filesEl = document.getElementById('__files')

let state = { files: [] }
const getState = () => state
const setFiles = (files) => state.files = files

var rpath = (file) => {
  if ('custom_relativePath' in file) {
    return file.custom_relativePath
  } else {
    return file.webkitRelativePath
  }
}

const saveAsZip = async (event) => {
  event.preventDefault()

  const zip = new JSZip()
  const folder = zip.folder()

  const files = getState().files
  if (!files.length) {
    alert('no files added, nothing to zip')
    return
  }
  files.forEach(file => folder.file(file.custom_relativePath, file))

  console.log(files[0])
  // NOTE: paths here are not os specific, safe to use '/'
  const dirName = rpath(files[0]).split('/')[0]
  zip.generateAsync({ type: "blob" })
    .then((content) => saveAs(content, `${dirName}.zip`))
}

// NOTE: in depth explanation https://stackoverflow.com/a/53058574/3754246
const getAllFileEntries = async (dataTransferItemList) => {
  dataTransferItemList = Array.from(dataTransferItemList) // make iterable

  const fileEntries = []
  const queue = [] // Use BFS to traverse entire directory/file structure

  dataTransferItemList.forEach(item => queue.push(item.webkitGetAsEntry()))

  while (queue.length > 0) {
    const entry = queue.shift()
    if (entry.isFile) {
      fileEntries.push(entry)
    }
    else if (entry.isDirectory) {
      queue.push(...await readAllDirectoryEntries(entry.createReader()))
    }
  }
  return fileEntries
}

const readAllDirectoryEntries = async (directoryReader) => {
  const entries = []
  let readEntries = await readEntriesPromise(directoryReader)
  while (readEntries.length > 0) {
    entries.push(...readEntries)
    readEntries = await readEntriesPromise(directoryReader)
  }
  return entries
}

const readEntriesPromise = async (directoryReader) => {
  try {
    return await new Promise((resolve, reject) => {
      // readEntry returns at most 100 entries, call it repeatedly
      directoryReader.readEntries(resolve, reject)
    })
  }
  catch (err) { console.log(err) }
}

const handleFilesChange = (files) => {
  setFiles(files)
  filesEl.innerHTML = getState().files.map(file => rpath(file)).join('<br/>')
}

// needed to prevent drag and drop from opening content in new tab
dropzoneEl.addEventListener('dragover', (event) => event.preventDefault())

dropzoneEl.addEventListener('drop', async (event) => {
  event.preventDefault()
  const entries = [...(await getAllFileEntries(event.dataTransfer.items))]
  const files = await Promise.all(
    entries.map(entry => new Promise((resolve, reject) => {
      entry.file((file) => {
        // NOTE: file.webkitRelativePath is empty but setting it does nothing
        // NOTE: mutation
        rpath(file) = entry.fullPath.slice(1) // remove first '/'
        resolve(file)
      })
    }))
  )
  handleFilesChange(files)
  // cleanup
  event.dataTransfer.clearData()
})

inputFolderEl.addEventListener('change', (event) => {
  event.preventDefault()
  handleFilesChange([...event.target.files])
  // cleanup
  event.target.files = null
})

inputFilesEl.addEventListener('change', (event) => {
  event.preventDefault()
  const files = [...event.target.files]
  files.forEach(file => {
    // NOTE: mutation
    rpath(file) = file.webkitRelativePath ? file.webkitRelativePath : file.name
  })
  handleFilesChange(files)
  // cleanup
  event.target.files = null
})

/* SIMPLE STUFF */

const uploadSingleFile = async (element) => {
  return await multipartRequest('/public/upload/single', {
    submission: element.
      parentElement.
      querySelector('.filePicker').
      files[0]
  })
}

const objectToFormData = (xkv) => {
  const fd = new FormData()
  Object.entries(xkv).forEach(([k, v]) => fd.append(k, v))
  return fd
}

const multipartRequest = async (path, xkv) => {
  const fd = objectToFormData(xkv)
  return await fetch(path, { method: 'POST', body: fd })
}

// const withCaptchaRequest = async (path, captchaToken, xkv) => {
//   return await fetch(path)
// }
