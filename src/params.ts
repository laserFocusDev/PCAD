// All dimensions in mm. Origin at board centre, Y up, X across the two water lines.

export const DEFAULTS = {
  boardLength: 420, boardWidth: 260, boardThickness: 12,
  lineOffset: 70, waterLineOD: 12,
  clampOD: 65, clampHeight: 40, clampZ1: -90, clampZ2: -40,
  pumpWidth: 60, pumpLength: 80, pumpHeight: 25, pumpZ: 30,
  flowWidth: 30, flowLength: 50, flowHeight: 35, flowZ: 80,
  pressureWidth: 40, pressureHeight: 45, pressureZ: 115,
  mixerDia: 60, mixerHeight: 90, mixerZ: -110,
  floatDia: 30, floatHeight: 70, floatZ: -40,
  encL: 60, encW: 70, encH: 50, encZ: 50,
}

export type Params = typeof DEFAULTS
export type ParamKey = keyof Params

interface Spec { key: ParamKey; label: string; group: string; min: number; max: number }
const S = (key: ParamKey, label: string, group: string, min: number, max: number): Spec =>
  ({ key, label, group, min, max })

export const SPECS: Spec[] = [
  S('boardLength', 'Length (X)', 'board', 200, 600),
  S('boardWidth', 'Width (Z)', 'board', 150, 400),
  S('boardThickness', 'Thickness', 'board', 6, 25),
  S('lineOffset', 'Line offset from centre', 'waterline', 40, 120),
  S('waterLineOD', 'Tube OD', 'waterline', 6, 25),
  S('clampOD', 'Clamp OD', 'clamp', 40, 100),
  S('clampHeight', 'Clamp height', 'clamp', 20, 80),
  S('clampZ1', 'Clamp 1 Z', 'clamp', -150, 150),
  S('clampZ2', 'Clamp 2 Z', 'clamp', -150, 150),
  S('pumpWidth', 'Width', 'pump', 30, 100),
  S('pumpLength', 'Length', 'pump', 40, 140),
  S('pumpHeight', 'Height', 'pump', 10, 50),
  S('pumpZ', 'Z position', 'pump', -150, 150),
  S('flowWidth', 'Width', 'flow', 20, 60),
  S('flowLength', 'Length', 'flow', 30, 100),
  S('flowHeight', 'Height', 'flow', 20, 60),
  S('flowZ', 'Z position', 'flow', -150, 150),
  S('pressureWidth', 'Width', 'pressure', 20, 80),
  S('pressureHeight', 'Height', 'pressure', 20, 90),
  S('pressureZ', 'Z position', 'pressure', -150, 150),
  S('mixerDia', 'Diameter', 'mixer', 30, 120),
  S('mixerHeight', 'Height', 'mixer', 40, 200),
  S('mixerZ', 'Z position', 'mixer', -150, 150),
  S('floatDia', 'Diameter', 'float', 15, 50),
  S('floatHeight', 'Height', 'float', 30, 120),
  S('floatZ', 'Z position', 'float', -150, 150),
  S('encL', 'Length (X)', 'enclosure', 40, 120),
  S('encW', 'Width (Z)', 'enclosure', 40, 120),
  S('encH', 'Height', 'enclosure', 20, 100),
  S('encZ', 'Z position', 'enclosure', -150, 150),
]

export interface Comp {
  id: string; name: string; qty: number
  material: string; process: string; tol: string; note: string
}

export const COMPONENTS: Comp[] = [
  { id: 'board', name: 'Base board', qty: 1, material: '6061-T6 aluminium', process: 'CNC mill, 12 mm plate', tol: '±0.1 mm', note: 'M5 clearance holes on 20 mm grid' },
  { id: 'clamp', name: 'Cartridge clamp', qty: 4, material: 'PETG (Al for production)', process: 'FDM, 100% infill', tol: '±0.2 mm', note: 'Two per water line; M5 clamp bolt' },
  { id: 'pump', name: 'Pump mount', qty: 2, material: '6061-T6 aluminium', process: 'CNC mill, 3 mm min wall', tol: '±0.05 mm bore', note: 'Vibration isolation pads underneath' },
  { id: 'flow', name: 'Flow-cell holder', qty: 2, material: 'PETG', process: 'FDM 3D print', tol: '±0.2 mm', note: 'Sensor port bore per flow-cell datasheet' },
  { id: 'pressure', name: 'Pressure sensor bracket', qty: 2, material: '304 stainless, 1.5 mm', process: 'Laser cut + 2 bends', tol: '±0.1 mm', note: 'Bend radius 1.5 mm' },
  { id: 'mixer', name: 'Mixing chamber holder', qty: 1, material: 'PETG', process: 'FDM 3D print', tol: '±0.2 mm', note: 'Snap ring; verify chamber OD' },
  { id: 'enclosure', name: 'Electronics enclosure', qty: 1, material: 'ABS', process: 'Off-the-shelf box, bored', tol: '±0.5 mm', note: 'M16 cable gland on rear wall' },
  { id: 'float', name: 'Float-switch holder', qty: 1, material: 'PETG', process: 'FDM 3D print', tol: '±0.2 mm', note: 'Slotted guide for float travel' },
  { id: 'waterline', name: 'Water line (mirror pair)', qty: 2, material: 'PTFE tube', process: 'Cut to length', tol: '±1 mm', note: 'Cut length = board width − 40 mm' },
]

export interface Assumption {
  id: string; label: string; value: number; unit: string; source: string; confirmed: boolean
}

export const ASSUMPTIONS: Assumption[] = [
  { id: 'maxPumpLen', label: 'Max pump body length', value: 90, unit: 'mm', source: 'Datasheet: pump PX-40 (rev B)', confirmed: false },
  { id: 'minWall', label: 'Minimum wall / plate', value: 3, unit: 'mm', source: 'DFM rule DFM-02 (PETG)', confirmed: false },
  { id: 'boltClr', label: 'M5 clearance hole', value: 5.5, unit: 'mm', source: 'ISO 273, medium fit', confirmed: false },
  { id: 'clampMinGap', label: 'Min gap between clamp edges', value: 10, unit: 'mm', source: 'Assumed: clamp bolt tool access', confirmed: false },
  { id: 'floatTravel', label: 'Float switch travel', value: 25, unit: 'mm', source: 'Datasheet: float FS-12 (assumed)', confirmed: false },
  { id: 'bench', label: 'Bench ambient temperature', value: 25, unit: '°C', source: 'Assumed: lab bench, no HVAC', confirmed: false },
]

export interface Check { label: string; ok: boolean; detail: string }

export function runChecks(p: Params, a: Assumption[]): Check[] {
  const v = (id: string) => a.find(x => x.id === id)?.value ?? 0
  const half = p.boardWidth / 2
  const clampGap = Math.abs(p.clampZ2 - p.clampZ1) - p.clampOD
  const encGap = p.lineOffset - p.clampOD / 2 - p.encL / 2
  const zMin = p.encZ - p.encW / 2
  const zMax = p.encZ + p.encW / 2
  const outOfRange = SPECS.filter(s => p[s.key] < s.min || p[s.key] > s.max).length

  return [
    { label: 'All parameters within limits', ok: outOfRange === 0, detail: `${outOfRange} out of range` },
    { label: 'Pump body fits mount', ok: p.pumpLength <= v('maxPumpLen'), detail: `${p.pumpLength} mm vs max ${v('maxPumpLen')} mm` },
    { label: 'Clamp edge spacing', ok: clampGap >= v('clampMinGap'), detail: `gap ${clampGap.toFixed(1)} mm vs min ${v('clampMinGap')} mm` },
    { label: 'Enclosure clears water lines', ok: encGap >= 3, detail: `clearance ${encGap.toFixed(1)} mm vs min 3 mm` },
    { label: 'Enclosure inside board', ok: zMin >= -half && zMax <= half, detail: `Z ${zMin.toFixed(0)} to ${zMax.toFixed(0)} mm` },
    { label: 'Board thickness ≥ min wall', ok: p.boardThickness >= v('minWall'), detail: `${p.boardThickness} mm vs ${v('minWall')} mm` },
    { label: 'Float holder ≥ travel + 20 mm', ok: p.floatHeight >= v('floatTravel') + 20, detail: `${p.floatHeight} mm vs ${v('floatTravel') + 20} mm` },
  ]
}