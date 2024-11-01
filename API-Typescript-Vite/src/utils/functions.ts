function extractEpisodeNumbers(urls: string[]): (number | null)[] {
  return urls.map((url) => {
    const match = url.match(/\/episode\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  });
}

export default extractEpisodeNumbers;
