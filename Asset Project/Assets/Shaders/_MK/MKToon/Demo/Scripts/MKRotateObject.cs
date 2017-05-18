using UnityEngine;
using System.Collections;

namespace MKToon
{
    public class MKRotateObject : MonoBehaviour
    {
        private float speed;
        public float Speed
        {
            get { return speed; }
            set { speed = value; }
        }
        void Update()
        {
            transform.localEulerAngles += new Vector3(0, 1, 0) * speed;
        }

        public UnityEngine.UI.Text text;
        public UnityEngine.UI.Slider slider;
        
        private void Awake()
        {
            speed = slider.value;
            SetTextValue();
        }

        public void SetTextValue()
        {
            text.text = System.Math.Round(speed, 2).ToString();
        } 
    }
}