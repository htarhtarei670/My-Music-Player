let wrapper = document.querySelector('.wrapper');
let musicName = wrapper.querySelector('.music-name');
let musicSinger = wrapper.querySelector('.music-artist');
let musicImage = wrapper.querySelector('.albumn-cover');
let musicSource = wrapper.querySelector('.main-audio');
let musicPlayPause = document.querySelector('.play-pause');
let musicNext = document.querySelector('#next');
let musicPrev = document.querySelector('#prev');
let progressBar = wrapper.querySelector('.progress-bar');
let musicCurrentTime = wrapper.querySelector('.current-time');
let musicDuration = wrapper.querySelector('.max-duration');
let progressArea = wrapper.querySelector('.progress-area');
let repeatBtn = wrapper.querySelector('#repeat');
let musicListShowBtn = document.querySelector('#more-music');
let musicList = wrapper.querySelector('.music-list');
let musicListCloseBtn = wrapper.querySelector('.music-list .close')

let musicIndex = 1;
isMusicPlay = true;
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingSong();
})

// to change music detail when we do a process

function loadMusic(index) {
    musicName.innerText = allMusic[index - 1].name;
    musicSinger.innerText = allMusic[index - 1].singer;
    musicImage.src = `images/${allMusic[index - 1].image}.jpg`;
    musicSource.src = `music/${allMusic[index - 1].source}.mp3`;
}

//to play music function
function playMusic() {
    wrapper.classList.add('paused');
    musicPlayPause.querySelector('i').innerText = 'pause';
    musicSource.play();

}

//to pause music function
function pauseMusic() {
    wrapper.classList.remove('paused');
    musicPlayPause.querySelector('i').innerText = 'play_arrow';
    musicSource.pause();
}

//next music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//prev music function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//current time and total duration change
musicSource.addEventListener('timeupdate', (e) => {
    currentTime = e.target.currentTime;
    Duration = e.target.duration;

    //to move circle every minute on progress bar
    const processWidth = (currentTime / Duration) * 100;
    progressBar.style.width = `${processWidth }%`

    musicSource.addEventListener('loadeddata', () => {
        // to update muisic duration 
        const duration = musicSource.duration;
        let min = Math.floor(duration / 60);
        let sec = Math.floor(duration % 60);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        musicDuration.innerText = `${min}:${sec}`;
    })

    // to update music current time
    let min = Math.floor(currentTime / 60);
    let sec = Math.floor(currentTime % 60);
    if (sec < 10) {
        sec = `0${sec}`
    }
    musicCurrentTime.innerText = `${min}:${sec}`
})

//change progress width according I move circle on progress bar
progressArea.addEventListener('click', (e) => {
    let progressClientWidth = progressArea.clientWidth;
    let clickPoint = e.offsetX;
    let duation = musicSource.duration;

    musicSource.currentTime = (clickPoint / progressClientWidth) * duation;
    playMusic();
    playingSong();
})

// when we click repeat btn,icon change process
repeatBtn.addEventListener('click', () => {
    let innerHtml = repeatBtn.innerText;
    switch (innerHtml) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Play One More Again');
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Play Ramdon Song');
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Play Looped');
            break;
    }
})

//each repeat btn processes
musicSource.addEventListener('ended', () => {
    let innerHtml = repeatBtn.innerText;
    switch (innerHtml) {
        case 'repeat':
            nextMusic();
            break;
        case 'repeat_one':
            musicSource.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
        case 'shuffle':
            let random = Math.floor(Math.random() * allMusic.length) + 1;
            console.log(random);
            do {
                random = Math.floor(Math.random() * allMusic.length) + 1;
            }
            while (musicIndex == random)
            musicIndex = random;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})

//when we click play pause btn
musicPlayPause.addEventListener('click', function() {
    const isMusicPlay = wrapper.classList.contains('paused');
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
})

//when we click next btn
musicNext.addEventListener('click', () => {
    nextMusic();
})

//when we click prev btn
musicPrev.addEventListener('click', () => {
    prevMusic();
})

// when we click music list btn
musicListShowBtn.addEventListener('click', () => {
    musicList.classList.toggle("show");
})

//when we click cross icon from music list box
musicListCloseBtn.addEventListener('click', () => {
    musicListShowBtn.click();
})

//add data from music list js file to music box
let uiTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
        <div>
            <p>${allMusic[i].name}</p>
            <span>${allMusic[i].singer}</span>
        </div>
        <div class="action ">
            <audio class='${allMusic[i].source}' src="music/${allMusic[i].source}.mp3" ></audio>
            <span class="audio-duration" id='${allMusic[i].source}'></span>
            <i class="material-icons " id="fav">favorite</i>
            <i class="material-icons ">more_vert</i>
        </div>
    </li>`
    uiTag.insertAdjacentHTML('beforeend', liTag);

    //add real duration time
    let liDuration = uiTag.querySelector(`#${allMusic[i].source}`);
    let liAudio = uiTag.querySelector(`.${allMusic[i].source}`);

    liAudio.addEventListener('loadeddata', () => {
        console.log(liAudio.duration);
        liAudioDuration = liAudio.duration;
        let min = Math.floor(liAudioDuration / 60);
        let sec = Math.floor(liAudioDuration % 60);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        liDuration.innerText = `${min}:${sec}`;
        liDuration.setAttribute("t-duration", `${min}:${sec}`);
    })
}

function playingSong() {
    const allLiTag = uiTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audio = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audio.getAttribute("t-duration");
            audio.innerText = adDuration;
        }

        //if the li tag index is equal to the musicIndex then add playing class in it
        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audio.innerText = "Playing";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

// music list li click fun
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}