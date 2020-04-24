define(['Class','EventManager'],function(Class,EventManager)
{
	var audioLib = {};
	var AudioManager = Class.extend({
		init:function(_audioList, callBack){
			
			this.eM = new EventManager();
			this.eM.addEventListener("playSound",this,this.playSound.bind(this));
			
			this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			this.musicGain = this.audioCtx.createGain();
			this.sfxGain = this.audioCtx.createGain();
			this.sfxAnalyser = this.audioCtx.createAnalyser();
			this.musicAnalyser = this.audioCtx.createAnalyser();
			this.biquad = this.audioCtx.createBiquadFilter();
			//this.biquad.type = 'lowpass';
			//this.biquad.frequency.value = 2000;
			//this.biquad.detune.value = 2000;
			
			this.volume = 1;
			this.musicGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
			this.sfxGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
			this.finish = this.audioCtx.destination;
			this.musicGain.connect(this.musicAnalyser).connect(this.finish);
			this.sfxGain.connect(this.sfxAnalyser).connect(this.finish);
			
			
			var toLoad = 0;
			var loaded = 0;
			
			this.sfxPlaying = [];
			this.musPlaying = [];
			
			this.fadeList = {};
			for(var key in _audioList)
			{	
				toLoad++;
			}
			
			for(var key in _audioList)
			{			
				var audio = new Audio(_audioList[key]);
				
				audioLib[key] = {sound:audio,
								node:this.audioCtx.createMediaElementSource(audio),
								name:key,
								path:_audioList[key]};
				audioLib[key].sound.addEventListener("ended",this.soundEnded.bind(this));
				audio.oncanplaythrough = function()
				{					
					loaded++;
					if(loaded == toLoad)
					{
						if(callBack != undefined)callBack();
					}
				}
			}
			
		},
		
		playSound:function(_data)
		{			
			audioLib[_data.name].node.disconnect();
			
			var gainNode = this.musicGain;
			if(_data.channel && _data.channel == "sfx")
			{
				this.musicGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
				//this.musicGain.gain.exponentialRampToValueAtTime(0.2, this.audioCtx.currentTime+ 0.5);
				if(this.musPlaying[0])this.updateFade(this.musPlaying[0].node,1,0.3,0.5);
				gainNode = this.sfxGain;
				if(audioLib[_data.name].sound.paused||!audioLib[_data.name].sound.currentTime)this.sfxPlaying.push(audioLib[_data.name].sound);
				audioLib[_data.name].node.connect(gainNode);
			}
			if(_data.channel && _data.channel == "music")
			{
				if(this.musPlaying[0] != undefined)
				{
					this.crossFade(this.musPlaying[0],audioLib[_data.name],5);
				}else{
					audioLib[_data.name].node.connect(gainNode);
				}
				if(audioLib[_data.name].sound.paused||!audioLib[_data.name].sound.currentTime)this.musPlaying.push(audioLib[_data.name]);
			}
			
			//
			
			if(_data.random ==true)
			{
				//this.biquad.type = (Math.random() >= 0.5 ? 'lowpass' : 'highpass');
				//this.biquad.frequency.value = (Math.random() * 1000) + 500;
				//this.biquad.detune.value = (Math.random() * 1000) + 500;
			}
			audioLib[_data.name].sound.currentTime = 0.001;
			audioLib[_data.name].sound.play();
		},
		
		soundEnded:function(_e)
		{
			var isAudio = false;
			for(var i = this.sfxPlaying.length-1;i>=0;i--)
			{
				if(_e.target == this.sfxPlaying[i])
				{
					this.sfxPlaying.splice(i,1);
					isAudio = true;
					break;
				}
			}
			//console.log("sfx stopping ", this.sfxPlaying.length);
			if(isAudio && this.volume != 0 && this.sfxPlaying.length ==0)
			{
				if(this.musPlaying[0])this.updateFade(this.musPlaying[0].node,0.3,1,3);
				//this.musicGain.gain.exponentialRampToValueAtTime(1, this.audioCtx.currentTime + 3);
			}
		},
		
		update:function(delta)
		{
			for(currentRamp in this.fadeList)
			{
				//console.log("how's this");
				var el = this.fadeList[currentRamp].elapsed += (delta /this.fadeList[currentRamp].time);
				if(this.fadeList[currentRamp].elapsed >= 1)
				{
					delete this.fadeList[currentRamp];
					continue;
				}
				var val = (this.fadeList[currentRamp].start-this.fadeList[currentRamp].end > 0? (1-el)*(1-el):el*el);
				var mx = Math.max(this.fadeList[currentRamp].start,this.fadeList[currentRamp].end);
				var mn = Math.min(this.fadeList[currentRamp].start,this.fadeList[currentRamp].end);
				val = (mx-mn)*val + mn;
				this.fadeList[currentRamp].val = val;
				this.fadeList[currentRamp].gain.gain.setValueAtTime(val, this.audioCtx.currentTime);
			}
			
		},
		
		crossFade:function(audioOut,audioIn,time)
		{
			this.updateFade(audioOut.node,0.01,1,time);
			this.updateFade(audioIn.node,1,0.01,time);
		},
		
		fade:function(audio,target,time,startVal)
		{
			if(target<=0)target = 0.001;
			if(startVal == undefined)startVal = 1;
			audio.disconnect();
			var gainFade = this.audioCtx.createGain(); 
			gainFade.gain.setValueAtTime(startVal, this.audioCtx.currentTime);
			audio.connect(gainFade).connect(this.musicGain);
			gainFade.gain.exponentialRampToValueAtTime(target, this.audioCtx.currentTime + time);
		},
		updateFade:function(audio,start,end,time)
		{
			if(this.fadeList[audio])
			{
				this.fadeList[audio].start = this.fadeList[audio].val;
				this.fadeList[audio].end = end;
				this.fadeList[audio].time = time;
				this.fadeList[audio].elapsed = 0;
			}else{
				audio.disconnect();
				var newGain = this.audioCtx.createGain();
				newGain.gain.setValueAtTime(start, this.audioCtx.currentTime);
				audio.connect(newGain).connect(this.musicGain);
				this.fadeList[audio] = {"gain":newGain,
										"start":start,
										"end":end,
										"time":time,
										"elapsed":0,
										"val":start};
			}
		}
	});
	return AudioManager;
});