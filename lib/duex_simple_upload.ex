defmodule DuexSimpleUpload do
  @moduledoc """
  Simple upload!
  """

  import Duex

  import Plug.Conn

  require Logger

  @spec init(any) :: any
  def init(opts), do: opts

  @spec call(Plug.Conn.t(), any) :: Plug.Conn.t()
  def call(conn, opts) do
    IO.inspect(conn)
    file_field = Keyword.get(opts, :file_field)
    x = conn.params[file_field]

    safe_full_path = x.path
    safe_filename = Path.basename(safe_full_path)

    unsafe_filename = x.filename
    extension = unsafe_filename |> Path.extname() |> filter_ascii()

    File.copy!(safe_full_path, Path.join([priv(), "uploads", safe_filename <> extension]))

    send_resp(conn, 200, %{ok: "uploaded"} |> Jason.encode!())
  end
end
