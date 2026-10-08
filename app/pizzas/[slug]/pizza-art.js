import { useId } from "react";
import { IngredientShape, ingredientKind } from "./ingredient-art";

const positions = [[98,91,22],[179,74,-18],[246,107,54],[79,166,-35],[157,147,10],[222,177,-16],[109,237,55],[190,238,-12],[264,234,20]];

export default function PizzaArt({ ingredient, dough = false, sweet = false }) {
  const id = useId().replace(/:/g, "");
  const kind = ingredient ? ingredientKind(ingredient.name) : "";
  return (
    <svg viewBox="0 0 360 360" aria-hidden="true">
      <defs>
        <radialGradient id={`crust-${id}`} cx="45%" cy="40%"><stop stopColor="#f5d79b" /><stop offset=".75" stopColor="#e3b06e" /><stop offset=".92" stopColor="#ca8b43" /><stop offset="1" stopColor="#edc385" /></radialGradient>
        <radialGradient id={`sauce-${id}`}><stop stopColor={sweet ? "#765039" : "#e06d40"} /><stop offset="1" stopColor={sweet ? "#442a21" : "#b74127"} /></radialGradient>
      </defs>
      {dough ? <>
        <circle cx="180" cy="183" r="158" fill="#99603b" />
        <circle cx="180" cy="177" r="158" fill={`url(#crust-${id})`} />
        <circle cx="180" cy="177" r="132" fill="#f1d3a0" stroke="#c99456" strokeWidth="2" />
        <circle cx="180" cy="177" r="122" fill={sweet ? "#e7c594" : "#e3bc82"} />
        {Array.from({length:32},(_,i)=>{const a=i*2.399; const r=140+(i%3)*5; return <ellipse key={i} cx={180+Math.cos(a)*r} cy={177+Math.sin(a)*r} rx={2+i%4} ry={1.5+i%3} fill={i%3?"#92572f":"#4a3022"} opacity={.35+i%4*.12} transform={`rotate(${i*31} ${180+Math.cos(a)*r} ${177+Math.sin(a)*r})`} />;})}
      </> : <>
        <circle className="pd-layer-guide" cx="180" cy="180" r="140" fill="none" stroke="#b99a72" strokeWidth="1" strokeDasharray="3 7" opacity=".35" />
        {(kind === "tomato" || kind === "chocolate") && <circle cx="180" cy="180" r="128" fill={`url(#sauce-${id})`} opacity=".92" />}
        {kind === "cheese" && <path d="M72 99Q120 37 164 69Q207 32 242 88Q292 83 289 141Q327 180 280 217Q284 273 224 281Q178 313 137 276Q78 292 75 238Q24 218 56 169Q31 119 72 99" fill="#fff1cf" stroke="#dcb675" strokeWidth="3" />}
        {(kind === "oil" || kind === "salt" || kind === "herb") ? Array.from({length:24},(_,i)=>{const a=i*2.399; const r=35+Math.sqrt(i/24)*92; const x=180+Math.cos(a)*r; const y=180+Math.sin(a)*r; return kind==="oil" ? <ellipse key={i} cx={x} cy={y} rx={3+i%3} ry={2+i%2} fill="#c9a23c" opacity=".7" /> : kind==="salt" ? <path key={i} d={`m${x} ${y} 4-3 5 4-4 4Z`} fill="#fff8ec" stroke="#d7c4b2" strokeWidth=".7" /> : <ellipse key={i} cx={x} cy={y} rx="2.5" ry="6" transform={`rotate(${i*47} ${x} ${y})`} fill={i%2?"#657643":"#8a975e"} />;}) : kind !== "cheese" && kind !== "chocolate" && positions.map(([x,y,r],i)=><g key={i} transform={`translate(${x-30} ${y-30}) rotate(${r} 30 30) scale(.6)`}><IngredientShape kind={kind} /></g>)}
        {kind === "chocolate" && <path d="M104 114q50 14 126-8m-143 70q83 23 162-5m-121 66q54 10 95-8" stroke="#97674b" strokeWidth="6" opacity=".4" fill="none" strokeLinecap="round" />}
      </>}
    </svg>
  );
}
