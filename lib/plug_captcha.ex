defmodule PlugCaptcha do
  @moduledoc """
  Plug to validate captcha.
  """

  use Plug.Builder

  plug(:captcha)

  @spec captcha(Plug.Conn.t(), keyword()) :: Plug.Conn.t()
  def captcha(conn, _opts) do
    # TODO: Push configuration for Recaptcha via Application.put_env like in megalith:
    ## https://github.com/doma-engineering/megalith/blob/25d1c9d275687dfeab00c7054d8f38e1e9c327ca/lib/cluster.ex#L61
    # TODO: Verify this works in Megalith
    if Application.get_env(:recaptcha, :secret) |> is_nil do
      # ^^^ TODO: Transform this into Uptight.Result solution ^^^
      send_resp(conn, 500, "recaptcha isn't configured on server side") |> halt()
    else
      case Recaptcha.verify(conn.body_params["captchaToken"]) do
        {:ok, %{challenge_ts: ts, hostname: host}} ->
          # TODO: check for hostname green-list, per configuration
          Plug.Conn.assign(
            conn,
            :captcha,
            %{challenge_ts: ts, hostname: host}
          )

        {:error, error} ->
          send_resp(conn, 403, error |> Jason.encode!())
          |> halt()
      end
    end
  end
end
