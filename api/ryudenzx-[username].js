import axios from "axios";

async function fetchRandomVideo(username) {
  try {
    const res = await axios.post(
      "https://tikwm.com/api/user/posts",
      {
        unique_id: username,
        count: 20
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
          "Referer": "https://tikwm.com/"
        },
        timeout: 8000
      }
    );

    const videos = res.data?.data?.videos;
    if (!videos?.length) return null;

    const valid = videos.filter(v => v.play);
    if (!valid.length) return null;

    const v = valid[Math.floor(Math.random() * valid.length)];

    return {
      play: v.play,
      cover: v.cover,
      title: v.title || "",
      author: v.author?.nickname || username
    };

  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      status: false,
      message: "Username required"
    });
  }

  const video = await fetchRandomVideo(username);

  if (!video) {
    return res.status(404).json({
      status: false,
      message: "No video found"
    });
  }

  return res.status(200).json({
    status: true,
    type: "user-shoti",
    data: video
  });
}
