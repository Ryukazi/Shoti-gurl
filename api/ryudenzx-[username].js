import axios from "axios";

async function fetchRandomVideo(username) {
  try {
    const res = await axios.post("https://tikwm.com/api/user/posts", {
      unique_id: username,
      count: 20
    }, { headers: { "Content-Type": "application/json" } });

    const videos = res.data?.data?.videos;
    if (!videos || !videos.length) return null;

    const validVideos = videos.filter(v => v.play);
    if (!validVideos.length) return null;

    return validVideos[Math.floor(Math.random() * validVideos.length)].play;
  } catch (err) {
    console.error(`❌ Failed for ${username}:`, err.response?.data || err.message);
    return null;
  }
}

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) return res.status(400).json({ error: "Username required" });

  const videoUrl = await fetchRandomVideo(username);

  if (!videoUrl) return res.status(404).json({ error: `No video found for user: ${username}` });

  try {
    const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"] || "video/mp4";

    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(response.data));
  } catch (err) {
    console.error("❌ Failed to stream video:", err.message);
    res.status(500).json({ error: "Failed to stream video." });
  }
      }
