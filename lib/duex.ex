defmodule Duex do
  @moduledoc """
  Documentation for `Duex`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Duex.hello()
      :world

  """
  def hello do
    :world
  end

  @spec priv :: binary()
  def priv, do: Application.app_dir(:duex, "priv")

  @spec index_html :: binary()
  def index_html, do: priv() <> "/index.html"

  @spec index_js :: binary()
  def index_js, do: priv() <> "/index.js"

  @spec pf(binary) :: binary()
  def pf(<<t::binary>>) do
    priv() <> "/" <> t
  end

  @spec filter_ascii(bitstring) :: bitstring
  def filter_ascii(xs) do
    for <<x <- xs>>, x in 0..127, into: "", do: <<x>>
  end
end
