defmodule Duex.RouterHuman do
  @moduledoc """
  Endpoints to access which a client has to pass a captcha.
  """

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  match _ do
    send_resp(conn, 404, "Say friend and enter")
  end
end
