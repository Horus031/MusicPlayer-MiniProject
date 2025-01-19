const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h1');
const cd = $('#cd');
const audio = $('#audio');
const playBtn = $('#btn-toggle-play');
const progress = $('#duration');
const nextBtn = $('#btn-next');
const prevBtn = $('#btn-prev');
const shuffleBtn = $('#btn-shuffle svg');
const repeatBtn = $('#btn-repeat svg');
const songBlock = $('#playlist');

// Objective
/**
    1. Render song
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
 */

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeated: false,
    songs: [
        {
            name: 'Buồn hay vui remake',
            singer: 'Horus ft. LilColG',
            path: './assets/music/audio1.mp3',
            image: './assets/img/img1.jpg',
        },
        {
            name: '3107 remake',
            singer: 'Horus x Cun',
            path: './assets/music/audio2.mp3',
            image: './assets/img/img2.jpg',
        },
        {
            name: 'Plastic Love (demo)',
            singer: 'Horus',
            path: './assets/music/audio3.mp3',
            image: './assets/img/img3.jpg',
        },
        {
            name: 'Changconchinua (demo)',
            singer: 'Horus',
            path: './assets/music/audio4.mp3',
            image: './assets/img/img4.jpg',
        },
        {
            name: 'Emcobietrang (demo)',
            singer: 'Horus',
            path: './assets/music/audio5.mp3',
            image: './assets/img/img5.jpg',
        },
        {
            name: 'Nghiveem (demo)',
            singer: 'Horus ft. Cun',
            path: './assets/music/audio6.mp3',
            image: './assets/img/img6.jpg',
        },
        {
            name: 'Sorrow (demo)',
            singer: 'Horus x Zit x Cun',
            path: './assets/music/audio7.mp3',
            image: './assets/img/img7.jpg',
        },
        {
            name: 'Time to say goodbye (demo)',
            singer: 'Horus',
            path: './assets/music/audio8.mp3',
            image: './assets/img/img8.jpg',
        },
        {
            name: 'Moments',
            singer: 'Horus',
            path: './assets/music/audio9.mp3',
            image: './assets/img/img9.png',
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div id="song-${index}" class="${index === this.currentIndex ? 'bg-red-500' : 'bg-white'} flex justify-between items-center p-2 mt-3 rounded-md">
                    <div class="flex items-center">
                        <img src="${song.image}" alt="" class="rounded-full h-12 lg:h-20 md:h-20 mr-6">
                        <div id="song__title-${index}" class="${index === this.currentIndex ? '[&>*]:text-white' : ''}">
                            <h1 class="font-bold text-lg">${song.name}</h1>
                            <h2 class="text-gray-400">${song.singer}</h2>
                        </div>
                    </div>

                    <div class="song__feature ${index === this.currentIndex ? '[&>*]:text-white' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" class="size-5">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                        </svg>
                    </div>
                </div>
            `
        }).join('');

        $('#playlist').innerHTML = htmls;
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;
        const cdHeight = cd.offsetHeight;
        const toggleBtn = $$('#btn-toggle-play svg');
        
        const handleToggleBtn = function() {
            if(toggleBtn[1].classList.contains('hidden')) {
                toggleBtn.forEach(button => {
                    button.classList.remove('hidden');
                })
                toggleBtn[0].classList.add('hidden');
            }
        }


        // Xử lý cd rotate và stop rotate
        const cdAnimate = cd.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();

        // Xu ly zoom in/out
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdHeight = cdHeight - scrollTop;

            cd.style.height = newCdHeight > 0 ? newCdHeight + 'px' : 0;
            cd.style.opacity = newCdHeight / cdHeight;
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            toggleBtn.forEach(button => {
                button.classList.toggle('hidden');
            })
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            cdAnimate.play();
        }
        // Khi bài hát pause
        audio.onpause = function() {
            _this.isPlaying = false;
            cdAnimate.pause();
        }

        // Khi bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekingTime = Math.floor(e.target.value * audio.duration / 100);
            audio.currentTime = seekingTime;
        }

        // Bật ngẫu nhiên bài hát
        shuffleBtn.onclick = function() {
            _this.isShuffle = !_this.isShuffle;
            shuffleBtn.classList.toggle('text-red-500', _this.isShuffle);
        }

        // Xử lý next song khi audio ended bằng sự kiện audio onended
        audio.onended = function() {
            if (_this.isRepeated) {
                audio.play();
            } else if (_this.isShuffle) {
                _this.shuffleSong();
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Lặp lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeated = !_this.isRepeated;
            repeatBtn.classList.toggle('text-red-500', _this.isRepeated);
        }

        // Click để chọn bài hát bất kỳ
        document.addEventListener("DOMContentLoaded", () => {
            const songs = Array.from(songBlock.children);
            // Khởi tạo các biến để lưu các phần tử
            let activeSong = $(`#song-${_this.currentIndex}`);
            let songElems = Array.from(activeSong.children);
            let songTitle = $(`#song__title-${_this.currentIndex}`);
            let songFeature = songElems[1];

            function updateActiveSong() {
                // Xóa class từ bài hát active trước
                activeSong.classList.remove('bg-red-500');
                activeSong.classList.add('bg-white');
                songTitle.classList.remove('[&>*]:text-white');
                songFeature.classList.remove('[&>*]:text-white');
        
                // Cập nhật phần tử của bài hát hiện tại
                activeSong = $(`#song-${_this.currentIndex}`);
                songElems = Array.from(activeSong.children);
                songTitle = $(`#song__title-${_this.currentIndex}`);
                songFeature = songElems[1];
        
                // Thêm các class vào bài hát đang active
                activeSong.classList.remove('bg-white');
                activeSong.classList.add('bg-red-500');
                songTitle.classList.add('[&>*]:text-white');
                songFeature.classList.add('[&>*]:text-white');
            }
        
            // Gọi hàm để tiến hành xử lý các phần tử
            updateActiveSong(); 

            songs.forEach((song, index) => {
                song.onclick = function(e) {
                    if (index !== _this.currentIndex && !e.target.closest('.song__feature')) {
                        handleToggleBtn();
                        _this.currentIndex = index;
                        updateActiveSong();
                        _this.loadCurrentSong();
                        audio.play();
                    }
                };
            });

            // Chuyển bài hát
            nextBtn.onclick = function() {
                if (_this.isShuffle) {
                    _this.shuffleSong();
                } else {
                    _this.nextSong();
                }
                handleToggleBtn();
                updateActiveSong();
                audio.play();
                _this.scrollToActiveSong();
            }

            prevBtn.onclick = function() {
                if (_this.isShuffle) {
                    _this.shuffleSong();
                } else {
                    _this.prevSong();
                }
                handleToggleBtn();
                updateActiveSong();
                audio.play();
                _this.scrollToActiveSong();
            }
        });  
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            const currentActiveSong = $(`#song-${this.currentIndex}`);
            currentActiveSong.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cd.src = this.currentSong.image;
        audio.src = this.currentSong.path;

    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    shuffleSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    start: function() {
        // Dinh nghia cac thuoc tinh cho Object
        this.defineProperties();
        // Lang nghe, xu li cac su kien
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        window.addEventListener("resize", () => {
            location.reload();
        });
    }
}

app.start();

