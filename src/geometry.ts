import * as THREE from 'three'
import type { Params } from './params'

// Placeholder geometry: boxes and cylinders standing in for detailed CAD.
// Bolt holes, fillets and bend relief are not modelled yet.
const COLOR = {
  board: '#8c979f', clamp: '#3a3d40', pump: '#5e6c76', flow: '#7d8f9c',
  pressure: '#b7bcc0', mixer: '#a9b3ba', float: '#3a3d40', enclosure: '#4a5058',
  waterline: '#4a6b82', selected: '#c8641e',
}

function material(id: string, sel: string | null, color: string) {
  return new THREE.MeshStandardMaterial({
    color: sel === id ? COLOR.selected : color,
    roughness: 0.55,
    metalness: 0.25,
  })
}

export function buildRig(p: Params, sel: string | null): THREE.Group {
  const g = new THREE.Group()
  g.name = 'rig'
  const t = p.boardThickness

  const add = (id: string, geo: THREE.BufferGeometry, color: string, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(geo, material(id, sel, color))
    m.position.set(x, y, z)
    m.userData.id = id
    g.add(m)
  }
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)
  const cyl = (r: number, h: number) => new THREE.CylinderGeometry(r, r, h, 48)

  add('board', box(p.boardLength, t, p.boardWidth), COLOR.board, 0, t / 2, 0)

  for (const s of [-1, 1]) {
    const x = s * p.lineOffset

    for (const z of [p.clampZ1, p.clampZ2]) {
      add('clamp', cyl(p.clampOD / 2, p.clampHeight), COLOR.clamp, x, t + p.clampHeight / 2, z)
    }
    add('pump', box(p.pumpWidth, p.pumpHeight, p.pumpLength), COLOR.pump, x, t + p.pumpHeight / 2, p.pumpZ)
    add('flow', box(p.flowWidth, p.flowHeight, p.flowLength), COLOR.flow, x, t + p.flowHeight / 2, p.flowZ)
    add('pressure', box(p.pressureWidth, p.pressureHeight, 8), COLOR.pressure, x, t + p.pressureHeight / 2, p.pressureZ)

    const zs = [-p.boardWidth / 2 + 20, p.clampZ1, p.clampZ2, p.pumpZ, p.flowZ, p.pressureZ, p.boardWidth / 2 - 20]
      .sort((a, b) => a - b)
    const curve = new THREE.CatmullRomCurve3(zs.map(z => new THREE.Vector3(x, t + 20, z)))
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 128, p.waterLineOD / 2, 12, false),
      material('waterline', sel, COLOR.waterline)
    )
    tube.userData.id = 'waterline'
    g.add(tube)
  }

  add('mixer', cyl(p.mixerDia / 2, p.mixerHeight), COLOR.mixer, 0, t + p.mixerHeight / 2, p.mixerZ)
  add('float', cyl(p.floatDia / 2, p.floatHeight), COLOR.float, 0, t + p.floatHeight / 2, p.floatZ)
  add('enclosure', box(p.encL, p.encH, p.encW), COLOR.enclosure, 0, t + p.encH / 2, p.encZ)

  return g
}

export function disposeObject(o: THREE.Object3D) {
  o.traverse(obj => {
    const m = obj as THREE.Mesh
    if (m.isMesh) {
      m.geometry.dispose()
      ;(m.material as THREE.Material).dispose()
    }
  })
}