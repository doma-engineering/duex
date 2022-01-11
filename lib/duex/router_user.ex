defmodule Duex.RouterUser do
  @moduledoc """
  Endpoints to access which a client has to be operated by a registered user.
  """

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  match _ do
    send_resp(conn, 404, "Welcome back")
  end
end
