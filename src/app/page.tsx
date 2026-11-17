'use client';
import { useEffect, useRef, useState } from 'react';
import { profiles, routeCopy, type Profile, type RouteId } from '@/lib/catalog';
const profileKeys: Profile[] = ['empresa', 'caminhoneiro', 'motorista', 'ajudante'];
export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    headingRef.current?.focus();
  }, [profile, route]);
  function reset() { setRoute(null); setProfile(null); }
  return <><a className="skipLink" href="#conteudo-principal">Pular para o conteúdo principal</a><main id="conteudo-principal" tabIndex={-1} className="shell">
    <header className="brand"><span className="brandIcon" aria-hidden="true">◆</span><div><strong>Plataforma Logística</strong><small>Site e aplicativo · arquitetura compartilhada</small></div></header>
    <section className="panel">
      {!profile && <><p className="eyebrow">PASSO 1</p><h1 ref={headingRef} tabIndex={-1}>Como você vai utilizar a plataforma?</h1><p className="muted">Escolha seu perfil para visualizar apenas as opções correspondentes.</p><div className="grid">{profileKeys.map(k => <button className="tile" key={k} onClick={() => setProfile(k)}><strong>{profiles[k].title}</strong><span>{profiles[k].description}</span></button>)}</div></>}
      {profile && !route && <><button className="back" onClick={reset}>← Trocar perfil</button><p className="eyebrow">PASSO 2 · {profiles[profile].title.toUpperCase()}</p><h1 ref={headingRef} tabIndex={-1}>O que você precisa fazer?</h1><div className="grid">{profiles[profile].actions.map(a => <button className="tile" key={a.label} onClick={() => setRoute(a.route)}><strong>{a.label}</strong><span>Ver detalhes →</span></button>)}</div></>}
      {profile && route && <><button className="back" onClick={() => setRoute(null)}>← Voltar às opções</button><p className="eyebrow">{profiles[profile].title.toUpperCase()}</p><h1 ref={headingRef} tabIndex={-1}>{routeCopy[route].title}</h1><p className="muted">{routeCopy[route].description}</p><div className="notice" role="status">Esta área ainda não executa operações. Publicação, contratação e pagamentos só serão habilitados após implementação, testes e homologação dos fluxos originais.</div></>}
    </section><footer>Ambiente de desenvolvimento · nenhuma contratação ou pagamento é realizado aqui.</footer>
  </main></>;
}
