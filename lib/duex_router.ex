defmodule DuexRouter do
  use Plug.Router

  plug(:match)
  plug(CORSPlug)
  plug(Plug.Logger, log: :debug)
  plug(:dispatch)

  forward("/public", to: Duex.RouterPublic)
  forward("/human", to: Duex.RouterHuman)
  forward("/user", to: Duex.RouterUser)

  match _ do
    send_resp(
      conn,
      404,
      "Please use one of the three access groups of the API: public, human or user"
    )
  end
end
