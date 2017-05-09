#pragma strict

var stepSoundsL = new AudioClip[1];
var stepSoundsR = new AudioClip[1];

var stepVolume = 0.5;

function Start () {

}

function StepSounds (side : int) {
	var steps = stepSoundsR;
	if (side < 0) {
		steps = stepSoundsL;
	}
	var step = steps[Random.Range(0, steps.length-1)];
	audio.PlayOneShot(step, stepVolume);
}