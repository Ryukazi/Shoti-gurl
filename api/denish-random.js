import axios from "axios";

const usernames = [
  "pinaybeautys", "ulzzangclub", "girl_indonesia0", "kripaverse",
  "rina55544", "beautifulgirlcollections", "yourmommyy__",
  "_sophiya1", "svn9o.__.ww", "hninphyusin2004",
  "sune_.0", "hvcqi", "mama_diorr", "allesandraniebres"
];

// Shuffle helper
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  const shuffled = shuffleArray([...usernames]);

  for (const username of shuffled) {
    const videoUrl = await fetchRandomVideo(username);
    if (videoUrl) {
      try {
        const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
        const contentType = response.headers["content-type"] || "video/mp4";

        res.setHeader("Content-Type", contentType);
        return res.send(Buffer.from(response.data));
      } catch (err) {
        console.error("❌ Failed to stream video:", err.message);
      }
    }
  }

  res.status(404).json({ error: "No valid videos found for any user." });
}
