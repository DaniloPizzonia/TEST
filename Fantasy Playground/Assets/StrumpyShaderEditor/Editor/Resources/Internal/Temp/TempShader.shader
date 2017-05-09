Shader "ShaderEditor/EditorShaderCache"
{
	Properties 
	{
_Color("Main Color", Color) = (1,1,1,1)
_ReflectColor("Reflection Color", Color) = (1,1,1,0.5)
_Shininess("Shininess", Range(0.01,1) ) = 0.078125
_MainTex("Base (RGB) Gloss (A)", 2D) = "white" {}
_Cube("Reflection Cubemap", Cube) = "black" {}
_BumpMap("Normalmap", 2D) = "bump" {}
_SpecularMap("Specularity (A)", 2D) = "white" {}

	}
	
	SubShader 
	{
		Tags
		{
"Queue"="Geometry"
"IgnoreProjector"="False"
"RenderType"="Opaque"

		}

		
Cull Back
ZWrite On
ZTest LEqual
ColorMask RGBA
Fog{
}


		CGPROGRAM
#pragma surface surf BlinnPhongEditor  vertex:vert
#pragma target 2.0


float4 _Color;
float4 _ReflectColor;
float _Shininess;
sampler2D _MainTex;
samplerCUBE _Cube;
sampler2D _BumpMap;
sampler2D _SpecularMap;

			struct EditorSurfaceOutput {
				half3 Albedo;
				half3 Normal;
				half3 Emission;
				half3 Gloss;
				half Specular;
				half Alpha;
				half4 Custom;
			};
			
			inline half4 LightingBlinnPhongEditor_PrePass (EditorSurfaceOutput s, half4 light)
			{
half3 spec = light.a * s.Gloss;
half4 c;
c.rgb = (s.Albedo * light.rgb + light.rgb * spec);
c.a = s.Alpha;
return c;

			}

			inline half4 LightingBlinnPhongEditor (EditorSurfaceOutput s, half3 lightDir, half3 viewDir, half atten)
			{
				half3 h = normalize (lightDir + viewDir);
				
				half diff = max (0, dot ( lightDir, s.Normal ));
				
				float nh = max (0, dot (s.Normal, h));
				float spec = pow (nh, s.Specular*128.0);
				
				half4 res;
				res.rgb = _LightColor0.rgb * diff;
				res.w = spec * Luminance (_LightColor0.rgb);
				res *= atten * 2.0;

				return LightingBlinnPhongEditor_PrePass( s, res );
			}
			
			struct Input {
				float2 uv_MainTex;
float3 viewDir;
float2 uv_SpecularMap;
float2 uv_BumpMap;

			};

			void vert (inout appdata_full v, out Input o) {
float4 VertexOutputMaster0_0_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_1_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_2_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_3_NoInput = float4(0,0,0,0);


			}
			

			void surf (Input IN, inout EditorSurfaceOutput o) {
				o.Normal = float3(0.0,0.0,1.0);
				o.Alpha = 1.0;
				o.Albedo = 0.0;
				o.Emission = 0.0;
				o.Gloss = 0.0;
				o.Specular = 0.0;
				o.Custom = 0.0;
				
float4 Sampled2D0=tex2D(_MainTex,IN.uv_MainTex.xy);
float4 Multiply3=_Color * Sampled2D0;
float4 Negative0= -float4( IN.viewDir.x, IN.viewDir.y,IN.viewDir.z,1.0 ); 
 float4 Sampled2D1=tex2D(_SpecularMap,IN.uv_SpecularMap.xy);
float4 Add1=Negative0 + Sampled2D1.aaaa;
float4 TexCUBE0=texCUBE(_Cube,Add1);
float4 Multiply0=TexCUBE0 * _ReflectColor;
float4 Invert0= float4(1.0, 1.0, 1.0, 1.0) - Sampled2D1.aaaa;
float4 Multiply1=Multiply0 * Invert0;
float4 Add0=Multiply3 + Multiply1;
float4 Tex2DNormal0=float4(UnpackNormal( tex2D(_BumpMap,(IN.uv_BumpMap.xyxy).xy)).xyz, 1.0 );
float4 Invert1= float4(1.0, 1.0, 1.0, 1.0) - Sampled2D1.aaaa;
float4 Multiply2=_Shininess.xxxx * Invert1;
float4 Master0_2_NoInput = float4(0,0,0,0);
float4 Master0_5_NoInput = float4(1,1,1,1);
float4 Master0_7_NoInput = float4(0,0,0,0);
float4 Master0_6_NoInput = float4(1,1,1,1);
o.Albedo = Add0;
o.Normal = Tex2DNormal0;
o.Specular = _Shininess.xxxx;
o.Gloss = Multiply2;

				o.Normal = normalize(o.Normal);
			}
		ENDCG
	}
	Fallback "Diffuse"
}