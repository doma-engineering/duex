defmodule Duex.RouterPublic do
  @moduledoc """
  Public endpoints.
  """

  use Plug.Router

  plug(Plug.Parsers,
    parsers: [:urlencoded, {:multipart, length: 1_000_000}, :json],
    pass: ["*/*"],
    json_decoder: Jason
  )

  plug(:match)
  plug(:dispatch)

  post("/upload/single") do
    Plug.run(conn, [{DuexSimpleUpload, []}])
  end

  match _ do
    send_resp(conn, 404, "Oopsie")
  end
end
