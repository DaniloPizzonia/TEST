#pragma strict

var particleTracing : boolean = false;
var allowRicochets : boolean = false;

var maxCastNumber : int = 50;	// Maximum number of simultanuous ballistic trajectories plotted.
private var activeCasts : BallisticStep[] = new BallisticStep[20];
var maxStepLength = 2000.0;		// Maximum distance one raycast can cross in one step. (kills physics for highspeed shots!!!)

var worldLayers : LayerMask;

var particles : ParticleSystem;

public class BallisticStep {
	var stepsLeft : int = 0;
	var stepPos : Vector3;
	var stepDir = Vector3.forward;
	var stepTime = 0.0;
	var stepDelay = 0.1;

	var projSpeed = 50.0;
	var projMass = 0.2;

	var impactFx : Transform;

	var baseDamage = 3.0;
	var armorPierce = 0.2;
	var bluntDamage = 2.0;
	var heatDamage = 0.0;

	var ricochetProba = 0.0;
}

function Start () {
	activeCasts = new BallisticStep[Mathf.Max(1, maxCastNumber)];
	for (var c : int; c<activeCasts.length; c++) {
		activeCasts[c] = new BallisticStep();
	}
}

function PlotNewCurve (newCast : BallisticStep) {
	var added : boolean = false;
	var leastCastsIndex : int = 0;
	var leastCasts : int = 0;
	// Add a new curve or replace an old one:
	for (var i : int; i<activeCasts.length; i++) {
		if (added == false && activeCasts[i]) {
			var stepsLeft = activeCasts[i].stepsLeft;
			if (stepsLeft <= 0) {
				activeCasts[i] = newCast;
				added = true;
			}
			else {
				if (stepsLeft < leastCasts) {
					leastCasts = stepsLeft;
					leastCastsIndex = i;
				}
			}
		}
	}
	// If it couldn't be added, replace the curve with the least casts remaining:
	// (The advantage here is that on short range, casts will still be done, but the longer ones will be interrupted early.)
	// (The disadvantage is that casts with low cast steps will be impossible, as they're cut before they really start.)
	if (added == false && activeCasts[leastCastsIndex]) {
		activeCasts[leastCastsIndex] = newCast;
	}

	// Trace shots using a particle system:
	if (particleTracing == true && particles != null) {
		var pPos = newCast.stepPos;
		var pVel = newCast.stepDir * newCast.projSpeed;
		var pEn = newCast.stepsLeft * newCast.stepDelay;
		particles.Emit(pPos+pVel.normalized*0.25, pVel, 0.07, pEn, Color(1.0, 0.75, 0.0, 1.0));
	}
}

function Update () {
	for (var i : int; i<activeCasts.length; i++) {
		if (activeCasts[i].stepsLeft > 0 && Time.time >= activeCasts[i].stepTime) {
			var ac = activeCasts[i];

			// 1. Calculate the next point on the curve:
			// (Do so by inserting the step update delay time into a parabolic trajectory formula. => ∆t)
			// Formulas:		Pxz	= P0xz + V0xz * ∆t
			//					Py	= P0y  + V0y  * ∆t - 0.5 * g * (∆t)²
			// Instead of P0 (pos. at time t=0), we'll just use the speed and pos. resulting from previous steps:
			var vx = Vector3.Scale(ac.stepDir * ac.projSpeed, Vector3(1.0, 0.0, 1.0)).magnitude;
			var vy = ac.stepDir.y * ac.projSpeed;
			var xOff = vx * ac.stepDelay;
			var yOff = (vy - 4.905 * ac.stepDelay) * ac.stepDelay;
			var xDir = Vector3.Scale(ac.stepDir, Vector3(1.0, 0.0, 1.0));
			var pos0 = ac.stepPos;
			var pos1 = pos0 + xDir * xOff + Vector3.up * yOff;
			// Don't forget to update the projectile velocity at that point!!!
			// Formula: Vy = V0y - g * ∆t		|		Vxz = V0xz
			var v = Vector3.up * (vy - 9.81 * ac.stepDelay) + xDir * vx;

			// 2. Cast a ray going from previous position to the new one:
			var ray : RaycastHit;
			if (Physics.Linecast(pos0, pos1, ray, worldLayers)) {
				// 3. Apply impact effects:
				// a) Damage model:
				var damage = new DamageStats();
				damage.baseDamage = ac.baseDamage;
				damage.armorPierce = ac.armorPierce;
				damage.bluntDamage = ac.bluntDamage;
				damage.heatDamage = ac.heatDamage;
				ray.transform.SendMessage("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
				// b) Graphical effects:
				if (ac.impactFx != null) {
					var ifx = Instantiate(ac.impactFx, ray.point, Quaternion.LookRotation(ray.normal));
					ifx.parent = ray.transform;
				}
				// c) Phyical forces:
				if (ray.rigidbody) {
					// Impact force is determined by:	F = dP/dt = m * dv / dt	( = m * a)
					var impactForce = Mathf.Max(0.0, ac.projMass * v.magnitude / Time.deltaTime);
					ray.rigidbody.AddForceAtPosition(impactForce * v.normalized, ray.point);
				}

				// Plot any ricochets or piercers:
				var bulletDeviation : boolean = false;
				// a) Ricochets:
				if (allowRicochets == true && ac.ricochetProba > 0.0 && Random.Range(0.0, 100.0) < ac.ricochetProba) {
					var norm = ray.normal;
					ac.stepDir = Vector3.Reflect(ac.stepDir, norm).normalized;
					ac.stepPos = ray.point + ac.stepDir * 0.05;
					ac.projSpeed *= Mathf.Max(1.0 - Mathf.Abs(Vector3.Dot(ac.stepDir, norm)), 0.2);
					ac.projMass *= 0.8;

					// Reduce damage of the reflected projectile:
					ac.baseDamage *= 0.5;
					ac.armorPierce *= 0.25;
					ac.bluntDamage *= 0.3;
					ac.heatDamage *= 0.85;

					// Request one last tracing step:
					ac.stepDelay *= 0.3;
					ac.stepsLeft = 1;
					ac.ricochetProba = 0.0;
					bulletDeviation = true;
//					Debug.Log("Ricochet!   (" + Time.time + ")");
				}

				// Reset cast query:
				if (bulletDeviation == false) {
					ac.stepsLeft = 0;
				}
			}
			// if there's no hit, standby for the next step:
			else {
				// 3. Update all values:
				ac.stepPos = pos1;
				ac.stepDir = v.normalized;
				ac.projSpeed = v.magnitude;

				// 4. Reduce the number of steps remaining and prepare the next cast:
				ac.stepsLeft --;
				ac.stepTime = Time.time + ac.stepDelay;
			}
		}
	}
}


























