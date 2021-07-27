import { gsap } from '/gsap.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1'

const world = {
    plane:{
        width: 14,
        height: 14,
        widthSegment: 10,
        heightSegment: 10
        
    }

}

const raycaster = new THREE.Raycaster()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight); // set size of canvas
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement);

camera.position.z = 5; 

const planeGeometry = new THREE.PlaneGeometry(5,5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial(
    {   //color: 0x5c9bcc,
        side: THREE.DoubleSide,
        flatShading: THREE.FlatShading, 
        vertexColors: true
    });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);

const light = new THREE.DirectionalLight(
    0xFFFFFF, // colour 
    1          // intensity
)
scene.add(light);

light.position.set(0, 0, 1) // x, y, x

const backLight = new THREE.DirectionalLight(
    0xFFFFFF, // colour 
    1          // intensity
)
scene.add(backLight);

backLight.position.set(0, 0, -1) // x, y, x
 
generatePlane()

const mouse ={
    x: undefined, 
    y: undefined
}


function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length > 0){
        const {color} = intersects[0].object.geometry.attributes

        color.setX(intersects[0].face.a,0)
        color.setY(intersects[0].face.a,1)
        color.setZ(intersects[0].face.a,0)

        color.setX(intersects[0].face.b,0)
        color.setY(intersects[0].face.b,1)
        color.setZ(intersects[0].face.b,0)

        color.setX(intersects[0].face.c,0)
        color.setY(intersects[0].face.c,1)
        color.setZ(intersects[0].face.c,0)

        intersects[0].object.geometry.attributes.color.needsUpdate = true

        const initialColour = {
            r: 0, 
            g: 0.19, 
            b: 0.4
        }

        const hoverColour = {
            r: 0.1, 
            g: 0.5, 
            b: 1
        }
        gsap.to(hoverColour, {
            r:initialColour.r, 
            g:initialColour.g, 
            b:initialColour.b,
            onUpdate: () => {
                color.setX(intersects[0].face.a,hoverColour.r)
                color.setY(intersects[0].face.a,hoverColour.g)
                color.setZ(intersects[0].face.a,hoverColour.b)

                color.setX(intersects[0].face.b,hoverColour.r)
                color.setY(intersects[0].face.b,hoverColour.g)
                color.setZ(intersects[0].face.b,hoverColour.b)

                color.setX(intersects[0].face.c,hoverColour.r)
                color.setY(intersects[0].face.c,hoverColour.g)
                color.setZ(intersects[0].face.c,hoverColour.b)
                color.needsUpdate = true 
            }
        })
    }
}

function generatePlane(){
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegment, world.plane.heightSegment)
    const {array} = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i+= 3){
        const x = array[i];
        const y = array[i+1];
        const z = array[i+2];
        array[i + 2] = z + Math.random();
    }

    const colors = []
    for(let i = 0; i <planeMesh.geometry.attributes.position.count; i++){
         colors.push(0, 0, 1);
    } 

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3)) 


}

const colors = []
for(let i = 0; i <planeMesh.geometry.attributes.position.count; i++){
    colors.push(0.1, 0.3, 0.82);
} 

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3)) 



animate();


addEventListener('mousemove', (event) =>
{
        mouse.x = (event.clientX / innerWidth) * 2 - 1
        mouse.y = -(event.clientY / innerHeight) * 2 + 1       
})
