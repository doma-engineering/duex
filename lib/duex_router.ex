defmodule DuexRouter do
  use Plug.Router

  plug(:match)
  plug(CORSPlug)
  plug(Plug.Logger, log: :debug)
  plug(:dispatch)

  forward("/public", to: Duex.RouterPublic)
  forward("/human", to: Duex.RouterHuman)
  forward("/user", to: Duex.RouterUser)

  @spec priv :: binary()
  def priv, do: Application.app_dir(:duex, "priv")

  @spec index_html :: binary()
  def index_html, do: priv() <> "/index.html"

  @spec index_js :: binary()
  def index_js, do: priv() <> "/index.js"

  match "/" do
    send_resp(conn, 200, File.read!(index_html()))
  end

  match "/index.html" do
    send_resp(conn, 200, File.read!(index_html()))
  end

  match "/index.js" do
    conn
    |> put_resp_content_type("application/javascript")
    |> send_resp(200, File.read!(index_js()))
  end

  match _ do
    send_resp(
      conn,
      404,
      "Please use one of the three access groups of the API: public, human or user"
    )
  end
end
