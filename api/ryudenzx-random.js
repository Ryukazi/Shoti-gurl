import axios from "axios";

const usernames = [
  "vix.max", "nepalibaddies2", "cewekcantikindo", "kripaverse",
  "rina55544", "nepali.modelshub7", "yourmommyy__",
  "mikxu_grgx", "svn9o.__.ww", "hninphyusin2004",
  "sune_.0", "hvcqi", "mama_diorr", "allesandraniebres",
  "amethystyaoki", "pinaybeauty.ph", "pinayspotted20",
  "aliyah8533", "sannymmaa"
];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

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
  try {
    const shuffled = shuffle([...new Set(usernames)]);

    for (const user of shuffled) {
      const video = await fetchRandomVideo(user);

      if (video) {
        return res.status(200).json({
          status: true,
          type: "shoti-random",
          data: video
        });
      }
    }

    return res.status(404).json({
      status: false,
      message: "No videos found"
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
  }
