using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SimpleFpsCounter : MonoBehaviour
{
	private float[] fpsCounts = null;
	[SerializeField]
	private int fpsAverageCount = 20;
	private float lastFrameTime = 0.0f;

	void Start()
	{
		fpsAverageCount = Mathf.Clamp(fpsAverageCount, 1, 144);
		fpsCounts = new float[fpsAverageCount];
	}

	void Update()
	{
		float curTime = Time.realtimeSinceStartup;
		float deltaTime = curTime - lastFrameTime;
		lastFrameTime = curTime;

		int count = fpsCounts.Length;
		for(int i = 0; i < count - 1; ++i)
			fpsCounts[i] = fpsCounts[i + 1];
		fpsCounts[count - 1] = 1.0f / deltaTime;
	}

	void OnGUI()
	{
		Rect rect = new Rect(Screen.width - 110, 10, 100, 22);
		GUI.BeginGroup(rect);
		GUI.Box(new Rect(0, 0, 100, 22), "");

		float average = 0.0f;

		int count = fpsCounts.Length;
		for(int i = 0; i < count; ++i)
			average += (float)fpsCounts[i];
		average /= (float)count;

		float averageRounded = Mathf.Round(average * 10.0f) * 0.1f;

		GUI.Label(new Rect(10, 0, 60, 22), "FPS:");
		GUI.Label(new Rect(70, 0, 60, 22), "" + averageRounded);

		GUI.EndGroup();
	}
}
