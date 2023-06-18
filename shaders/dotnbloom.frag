/*
     Dot 'n bloom shader
     Author: Themaister
     License: Public domain
*/
// modified by slime73 for use with love pixeleffects


extern vec2 textureSize;

const float gamma = 2.4;
const float shine = 0.05;
const float blend = 0.65;

float dist(vec2 coord, vec2 source)
{
	vec2 delta = coord - source;
	return sqrt(dot(delta, delta));
}

float color_bloom(vec3 color)
{
	const vec3 gray_coeff = vec3(0.30, 0.59, 0.11);
	float bright = dot(color, gray_coeff);
	return mix(1.0 + shine, 1.0 - shine, bright);
}

vec3 lookup(Image texture, float offset_x, float offset_y, vec2 tex_coords, vec2 pixel_coords)
{
	vec2 offset = vec2(offset_x, offset_y);
	vec3 color = Texel(texture, tex_coords).rgb;
	float delta = dist(fract(pixel_coords * textureSize), offset + vec2(0.5));
	return color * exp(-gamma * delta * color_bloom(color));
}

vec4 effect(vec4 vcolor, Image texture, vec2 tex_coords, vec2 pixel_coords)
{
	float dx = 1.0 / textureSize.x;
	float dy = 1.0 / textureSize.y;

	// number a = Texel(texture, tex_coords).a;

	vec2 c00 = tex_coords + vec2(-dx, -dy);
	vec2 c10 = tex_coords + vec2(  0, -dy);
	vec2 c20 = tex_coords + vec2( dx, -dy);
	vec2 c01 = tex_coords + vec2(-dx,   0);
	vec2 c11 = tex_coords + vec2(  0,   0);
	vec2 c21 = tex_coords + vec2( dx,   0);
	vec2 c02 = tex_coords + vec2(-dx,  dy);
	vec2 c12 = tex_coords + vec2(  0,  dy);
	vec2 c22 = tex_coords + vec2( dx,  dy);

	vec3 mid_color = lookup(texture, 0.0, 0.0, c11, pixel_coords);
	vec3 color = vec3(0.0);
	color += lookup(texture, -1.0, -1.0, c00, pixel_coords);
	color += lookup(texture,  0.0, -1.0, c10, pixel_coords);
	color += lookup(texture,  1.0, -1.0, c20, pixel_coords);
	color += lookup(texture, -1.0,  0.0, c01, pixel_coords);
	color += mid_color;
	color += lookup(texture,  1.0,  0.0, c21, pixel_coords);
	color += lookup(texture, -1.0,  1.0, c02, pixel_coords);
	color += lookup(texture,  0.0,  1.0, c12, pixel_coords);
	color += lookup(texture,  1.0,  1.0, c22, pixel_coords);
	vec3 out_color = mix(1.2 * mid_color, color, blend);

	return vec4(out_color, 1.0);
}
