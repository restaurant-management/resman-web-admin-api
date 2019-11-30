const videoContent = document.createElement('section');
videoContent.className = 'videocontent';
videoContent.id = 'video';
videoContent.insertAdjacentHTML('afterbegin', '<div class="video-background video-bg-8" style="height: 1370px;"><video preload="auto" autoplay="autoplay" loop="loop"><source src="assets/videobg/8.mp4" type="video/mp4"><source src="assets/videobg/8.webm" type="video/webm"><source src="assets/videobg/8.ogv" type="video/ogg"></video></div><div class="ui-video-background ui-widget ui-widget-content ui-corner-all"><ul class="ui-video-background-controls"><li class="ui-video-background-play"><a class="ui-icon ui-icon-pause" href="#">undefined</a></li><li class="ui-video-background-mute"><a class="ui-icon ui-icon-volume-off" href="#">undefined</a></li></ul></div>');

export { videoContent as VideoContent };
