defmodule Duex.RouterHuman do
  @moduledoc """
  Endpoints to access which a client has to pass a captcha.
  """

  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [
      :urlencoded,
      {:multipart, length: 8_000_000, include_unnamed_parts_at: "_unnamed"},
      :json
    ],
    pass: ["*/*"],
    json_decoder: Jason
  )

  plug(:dispatch)

  post("/upload/single") do
    Plug.run(conn, [{Arclight.PlugCaptcha, []}, {DuexSimpleUpload, [file_field: "submission"]}])
  end

  match _ do
    send_resp(conn, 404, "Say friend and enter")
  end
end
