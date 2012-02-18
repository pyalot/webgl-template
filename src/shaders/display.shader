varying vec3 vNormal;

#include "./spherical_harmonics"

vertex:
    attribute vec3 position, normal;
    uniform mat4 proj, view, model;
    
    void main(){
        vNormal = mat3(model) * normal;
        gl_Position = proj * view * model * vec4(position, 1.0);
    }

fragment:

    void main(){
        vec3 normal = normalize(vNormal);
        vec3 incident = shLight(normal, beach);
        gl_FragColor = vec4(incident, 1.0);
    }
