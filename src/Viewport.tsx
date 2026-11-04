import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildRig, disposeObject } from './geometry'
import type { Params } from './params'

interface Props { params: Params; selected: string | null }

export function Viewport({ params, selected }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  // One-time scene setup
  useEffect(() => {
    const el = mountRef.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ebe7dd')
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(35, 1, 1, 5000)
    camera.position.set(480, 380, 520)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 40, 0)

    scene.add(new THREE.HemisphereLight('#ffffff', '#6d6a62', 1.6))
    const key = new THREE.DirectionalLight('#ffffff', 1.2)
    key.position.set(300, 600, 300)
    scene.add(key)
    scene.add(new THREE.GridHelper(800, 40, '#b9b4a8', '#d3cec2'))

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let raf = 0
    const loop = () => {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      disposeObject(scene)
      renderer.dispose()
      el.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [])

  // Live rebuild on parameter or selection change
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const old = scene.getObjectByName('rig')
    if (old) {
      scene.remove(old)
      disposeObject(old)
    }
    scene.add(buildRig(params, selected))
  }, [params, selected])

  return (
    <div className="viewport">
      <div ref={mountRef} className="canvas-host" />
      <div className="hud">
        BENCH RIG · MOUNTING HARDWARE · mm · Y up · origin at board centre
      </div>
    </div>
  )
}