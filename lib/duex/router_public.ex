defmodule Duex.RouterPublic do
  @moduledoc """
  Public endpoints.
  """

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  match _ do
    send_resp(conn, 404, "Oopsie")
  end
end
