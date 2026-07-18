let songs = [
    {
    title: "Born To Touch Your Feelings",
    author: "SCORPIONS",
    duration: "6:15",
    cover: "./imgs/ab67616d00001e02a17a0c43c47f9a317d9fdc7a.jpg",
    src: "./sounds/Born to Touch Your Feelings (MTV Unplugged) - Scorpions (128k).mp3",
    },

    {
    title: "Нужна",
    author: "M'Dee",
    duration: "4:19",
    cover: "./imgs/ac920bfe0d8c353fa8eca26bb9da0871.1000x1000x1.png",
    src: "./sounds/M’Dee – нужна (Алматинский джаз, Vol.3) - M'Dee (128k).mp3",
    },

    {
    title: "Invincible",
    author: "TOOL",
    duration: "12:46",
    cover: "./imgs/1900x1900-000000-80-0-0.jpg",
    src: "./sounds/TOOL - Invincible (Official Audio) - TOOL (128k).mp3",
    },

    {
    title: "parabola",
    author: "TOOL",
    duration: "10:08",
    cover: "./imgs/828765759199.jpg",
    src: "./sounds/TOOL - Parabola (Official Video).mp3",
    },
];

const vinyl = document.getElementById("vinylDisk");
const tonearm = document.getElementById("tonearm");
const playBtn = document.getElementById("playBtn");
const currentTitle = document.getElementById("currentTitle");
const theAuthor = document.getElementById("currentArtist");
const playList = document.getElementById("playlist");
const totalTime = document.getElementById("totalTime");
const playIcon = document.getElementById("playIcon");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const currentTimeDisplay = document.getElementById("currentTime");
const progress = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar")

let isPlaying = false;
let volumeInterval;
let currentSongId = 0;
let playTimeOut;
const songAudio = new Audio();
const needleSound = new Audio("./sounds/Needle Drop sound effect.mp3");

songAudio.src = songs[currentSongId].src

playBtn.addEventListener("click", function(){
    if (isPlaying === true){
        isPlaying = false
        stopPlaying();
        songAudio.volume = 1;
        playIcon.classList.add("fa-play");
        playIcon.classList.remove("fa-pause");
    }
    else if (isPlaying === false) {
        isPlaying = true;
        vinyl.style.animationPlayState = "running";
        tonearm.classList.add("playing");
        vinyl.style.animationDelay = "0.7s";
        needleSound.play();
        songAudio.volume = 0;
        playTimeOut = setTimeout(function(){
            songAudio.play();
            volumeInterval = setInterval(() => {
                songAudio.volume += 0.05;
                if (songAudio.volume >= 1){
                songAudio.volume = 1
                clearInterval(volumeInterval)
            }
            }, 50);
            
        }, 3000); 
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    }
});

function stopPlaying(){
    clearTimeout(playTimeOut);
    clearInterval(volumeInterval);
    songAudio.pause();
    needleSound.pause();
    tonearm.classList.remove("playing");
    vinyl.style.animationPlayState = "paused";
}

function buildPlaylist(){
    playList.innerHTML = "";
    songs.forEach(function(song,index) {
        const songCard = document.createElement("div");
        songCard.classList.add("song-card")
        songCard.innerHTML = `<img class="song-cover" src="${song.cover}" alt="Song Cover">
                                <div class="song-details">
                                    <div class="song-name">${song.title}</div>
                                    <div class="song-singer">${song.author}</div>
                                </div>
                                <div class="song-actions">
                                    <i class="fa-regular fa-heart"></i>
                                </div>
                                <div class="song-duration">${song.duration}</div>`;
        playList.appendChild(songCard);
        
        songCard.addEventListener("click", () => {
            loadSong(index);
        })
    });
};

function loadSong(index) {
    stopPlaying();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    isPlaying = false;
    currentSongId = index;
    songAudio.src = songs[currentSongId].src;
    currentTitle.textContent = songs[currentSongId].title;
    theAuthor.textContent = songs[currentSongId].author;
    totalTime.textContent = songs[currentSongId].duration;
    progress.style.width = "0%";
    currentTimeDisplay.textContent = "0:00";
}

nextBtn.addEventListener("click", function(){
    let nextSong = currentSongId + 1;
    if (nextSong === songs.length) nextSong = 0;
    loadSong(nextSong);
})

prevBtn.addEventListener("click", function(){
    let prevSong = currentSongId - 1;
    if (prevSong === -1) prevSong = songs.length - 1;
    loadSong(prevSong);
})

songAudio.addEventListener("timeupdate", function(e){
    const current = songAudio.currentTime;
    const duration = songAudio.duration;
    let progressPercent = current/duration * 100;
    progress.style.width  = `${progressPercent}%`;
    let minutes = Math.floor(current / 60);
    let seconds = Math.floor(current % 60);
    if (seconds < 10) seconds = "0" + seconds;
    currentTimeDisplay.textContent = minutes + ":" + seconds; 
});

songAudio.addEventListener("ended", function(){
    stopPlaying();
    isPlaying = false;
    progress.style.width = "0%";
    playIcon.classList.add("fa-play");
    playIcon.classList.remove("fa-pause");
    currentTimeDisplay.textContent = "0:00";
});

progressBar.addEventListener("click", function(e){
    let width = progressBar.offsetWidth;
    let position = e.offsetX;
    songAudio.currentTime = (position/width) * songAudio.duration;
});

loadSong(0);
buildPlaylist();