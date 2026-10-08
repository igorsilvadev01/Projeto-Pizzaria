import { useId } from "react";

export function ingredientKind(name) {
  if (/tomate/i.test(name)) return "tomato";
  if (/fior|muçarela/i.test(name)) return "cheese";
  if (/manjericão/i.test(name)) return "basil";
  if (/azeite/i.test(name)) return "oil";
  if (/calabresa/i.test(name)) return "sausage";
  if (/cebola/i.test(name)) return "onion";
  if (/orégano|tomilho/i.test(name)) return "herb";
  if (/shiitake|portobello/i.test(name)) return "mushroom";
  if (/shimeji/i.test(name)) return "shimeji";
  if (/alho/i.test(name)) return "garlic";
  if (/chocolate/i.test(name)) return "chocolate";
  if (/morango/i.test(name)) return "strawberry";
  return "salt";
}

// Original vector artwork, shared by the portraits and interactive layers.
export function IngredientShape({ kind }) {
  switch (kind) {
    case "tomato": return <g><path d="M25 45C20 17 77 10 83 43C93 76 66 91 43 84C22 79 18 59 25 45Z" fill="#c74329" /><path d="M33 43C33 24 69 21 74 43" fill="none" stroke="#ed7250" strokeWidth="5" strokeLinecap="round" /><path d="m54 30-14-9 13 2 8-15 2 17 17-4-12 11 2 9-11-8-9 9Z" fill="#47603c" /></g>;
    case "cheese": return <g><path d="M19 58C17 30 42 19 65 26C89 34 93 68 73 79C44 93 22 78 19 58Z" fill="#eadbc0" /><path d="M22 51C23 27 52 20 73 34C89 49 78 66 56 71C31 75 20 63 22 51Z" fill="#fffaf0" /><path d="M35 35C44 29 58 29 64 32" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></g>;
    case "basil": return <g><path d="M50 86 54 40" stroke="#4b6840" strokeWidth="4" /><path d="M54 69C20 77 12 45 19 23C49 26 57 43 54 69" fill="#4f7945" /><path d="M54 62C50 28 70 16 88 18C88 42 80 64 54 62" fill="#719557" /><path d="M54 69 27 35m27 27 25-32" stroke="#bed09b" strokeWidth="1.5" fill="none" /></g>;
    case "oil": return <g><path d="M38 24h24v11l10 13v35H28V48l10-13Z" fill="#969341" /><path d="M32 50h36v28H32Z" fill="#c7ae52" /><path d="M36 54h28v17H36Z" fill="#f7edcc" /><path d="M40 13h20v15H40Z" fill="#4c5137" /><path d="M38 40v37" stroke="#eee6a2" strokeWidth="4" opacity=".6" /><path d="M79 65s-13 17-6 22c10 8 19-4 6-22Z" fill="#c8a443" /></g>;
    case "sausage": return <g transform="rotate(-22 50 50)"><ellipse cx="48" cy="40" rx="27" ry="21" fill="#754234" /><path d="M21 40v17c0 29 54 29 54 0V40" fill="#a9684c" /><ellipse cx="48" cy="40" rx="25" ry="19" fill="#cd8967" /><ellipse cx="48" cy="40" rx="20" ry="15" fill="#b76f53" />{[[37,35],[49,28],[59,38],[42,47],[55,49]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="3" ry="2" fill="#f1ceb0" />)}<ellipse cx="73" cy="70" rx="17" ry="13" fill="#b76f53" stroke="#df9c76" strokeWidth="3" /><path d="m68 65 6 2m-3 7 7-2" stroke="#f1ceb0" strokeWidth="3" /></g>;
    case "onion": return <g><path d="M23 62C13 43 29 19 48 14C57 20 82 39 81 59C81 89 34 92 23 62Z" fill="#754056" /><path d="M33 62C29 42 45 29 57 34C86 42 82 75 57 82C44 84 32 74 33 62Z" fill="#edd5da" /><path d="M42 62C38 46 50 39 59 43C77 48 75 69 58 73C49 76 43 70 42 62Z" fill="none" stroke="#a7647e" strokeWidth="3" /><ellipse cx="57" cy="58" rx="7" ry="9" fill="none" stroke="#a7647e" strokeWidth="2" /><path d="m45 18 3-8 7 9" fill="#bd8778" /></g>;
    case "herb": return <g><path d="m33 89 30-71m-19 45-25-21m36 5 24-15" fill="none" stroke="#647048" strokeWidth="3" />{[[40,70,-35],[53,62,35],[47,48,-35],[61,43,40],[53,30,-30],[64,20,10],[30,52,-55],[72,36,45]].map(([x,y,r],i)=><ellipse key={i} cx={x} cy={y} rx="7" ry="12" transform={`rotate(${r} ${x} ${y})`} fill={i%2?"#7e8b56":"#536f44"} />)}</g>;
    case "mushroom": return <g><path d="m44 47-7 37c10 10 25 9 31 1L59 45Z" fill="#e8d7bd" /><path d="M17 51C13 4 82 8 86 51C68 67 37 66 17 51Z" fill="#886449" /><path d="M20 49C35 61 68 60 83 49" fill="none" stroke="#604432" strokeWidth="5" /><path d="M30 31c12-13 30-10 39-3" fill="none" stroke="#b08a68" strokeWidth="4" strokeLinecap="round" /><path d="m45 58-3 21" stroke="#fbefdc" strokeWidth="4" /></g>;
    case "shimeji": return <g>{[[34,43,-18],[53,33,0],[70,48,15],[46,60,-8]].map(([x,y,r],i)=><g key={i} transform={`rotate(${r} ${x} ${y})`}><path d={`M${x-3} ${y}v34h9l-1-34Z`} fill="#e9d9bd" /><ellipse cx={x} cy={y} rx="14" ry="10" fill={i%2?"#a78c69":"#94795a"} /><path d={`M${x-9} ${y-2}q8-8 16-1`} fill="none" stroke="#c5ad87" strokeWidth="2" /></g>)}</g>;
    case "garlic": return <g><path d="M46 13h12l-1 18C91 38 92 77 69 83C39 96 14 69 25 45C29 35 41 33 47 29Z" fill="#e7d9c7" /><path d="M50 30C35 40 34 69 48 84m6-54c14 19 15 40 4 56" fill="none" stroke="#c9b5a3" strokeWidth="2" /><path d="M31 43q-8 15 0 29" fill="none" stroke="#fff8eb" strokeWidth="5" strokeLinecap="round" /><path d="M78 65C94 58 100 80 84 90C73 92 71 75 78 65Z" fill="#faf1de" stroke="#d5c2a9" /></g>;
    case "chocolate": return <g transform="rotate(-18 50 50)"><path d="M18 26h66v53H18Z" fill="#482a22" /><path d="M18 73h66v9H18Z" fill="#332018" />{[0,1,2,3,4,5].map(i=><g key={i}><rect x={23+i%3*20} y={31+Math.floor(i/3)*22} width="16" height="18" rx="2" fill="#6a4433" /><path d={`M${25+i%3*20} ${35+Math.floor(i/3)*22}h11`} stroke="#966950" strokeWidth="2" /></g>)}</g>;
    case "strawberry": return <g><path d="M21 34C12 51 33 87 51 93C70 80 89 49 78 33C61 19 39 21 21 34Z" fill="#c94737" /><path d="M30 37C22 44 27 59 31 64" fill="none" stroke="#ee7b62" strokeWidth="5" strokeLinecap="round" /><path d="m51 32-21-9 16 1 4-14 8 13 18-3-15 13-10 11Z" fill="#567544" />{[[40,44],[58,48],[46,60],[65,61],[53,77],[33,53]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="1.5" ry="2.5" fill="#f3d99a" />)}</g>;
    default: return <g fill="#fffaf0" stroke="#cdbda9" strokeWidth="1.5"><path d="m23 55 13-15 15 13-13 12Z" /><path d="m56 29 13-8 13 16-14 5Z" /><path d="m57 64 16-13 14 15-14 14Z" /><path d="m29 79 9-7 8 10-11 6Z" /><path d="m48 45 5-6 6 5-5 7Z" /></g>;
  }
}

export default function IngredientArt({ name, className = "" }) {
  const id = useId().replace(/:/g, "");
  return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><defs><filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#442d1b" floodOpacity=".13" /></filter></defs><g filter={`url(#shadow-${id})`}><IngredientShape kind={ingredientKind(name)} /></g></svg>;
}
