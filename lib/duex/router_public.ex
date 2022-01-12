defmodule Duex.RouterPublic do
  @moduledoc """
  Public endpoints.
  """

  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:urlencoded, {:multipart, length: 1_000_000}, :json],
    pass: ["*/*"],
    json_decoder: Jason
  )

  plug(:dispatch)

  post("/upload/single") do
    Plug.run(conn, [{DuexSimpleUpload, [file_field: "submission"]}])
  end

  match _ do
    send_resp(conn, 404, "Oopsie")
  end
end
