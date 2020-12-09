#version 330
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct LightSource {
    vec4 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
layout (std140) uniform Light
{
    vec4 light_position;
    vec3 light_ambient;
    vec3 light_diffuse;
    vec3 light_specular;
};

in highp mat3 TBN;
out highp vec4 fragColor;
uniform highp vec3 viewPos;
uniform Material material;
uniform float opacity;
in highp VERTEX_OUT{
    vec3 FragPos;
} vertex_out;

vec4 xygrid(vec2 coord, vec4 color, vec4 gridcolor);

void main() {
    vec3 norm = normalize(TBN[2]);
    // ambient
    vec3 ambient = light_ambient * material.ambient;
    // diffuse
    vec3 lightDir = normalize(light_position.xyz);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light_diffuse * (diff * material.diffuse);
    // specular
    vec3 viewDir = normalize(viewPos - vertex_out.FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light_specular * (spec * material.specular);
    vec3 result = ambient + diffuse + specular;
    fragColor = xygrid(vertex_out.FragPos.xy, vec4(result, opacity), vec4(135, 135, 135, 255)/255);
}