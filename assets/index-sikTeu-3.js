import { initializeApp as pe } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth as re,
  onAuthStateChanged as $e,
  signOut as z,
  signInWithEmailAndPassword as Le,
  createUserWithEmailAndPassword as ge,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore as Te,
  updateDoc as O,
  doc as L,
  getDoc as _,
  getDocs as D,
  collection as C,
  query as $,
  where as v,
  writeBatch as De,
  serverTimestamp as H,
  addDoc as de,
  onSnapshot as Q,
  setDoc as Y,
  deleteDoc as Ne,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getStorage as getSt,
  ref as sr,
  uploadBytes as ub,
  getDownloadURL as gdu,
  listAll as la,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) o(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const r of n.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && o(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const n = {};
    return (
      s.integrity && (n.integrity = s.integrity),
      s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (n.credentials = "omit")
          : (n.credentials = "same-origin"),
      n
    );
  }
  function o(s) {
    if (s.ep) return;
    s.ep = !0;
    const n = t(s);
    fetch(s.href, n);
  }
})();
const fe = {
  apiKey: "AIzaSyBI_PS9poJyyCrGgTXaU82xNoEGCh6jFK0",
  authDomain: "portal-rac.firebaseapp.com",
  projectId: "portal-rac",
  storageBucket: "portal-rac.firebasestorage.app",
  messagingSenderId: "844052242861",
  appId: "1:844052242861:web:03aff23e67ec52c07fc124",
},
  he = pe(fe),
  P = re(he),
  u = Te(he),
  st = getSt(he),
  me = {
    login: document.getElementById("login-section"),
    cursoSelection: document.getElementById("curso-selection-section"),
    aluno: document.getElementById("aluno-dashboard"),
    professor: document.getElementById("professor-dashboard"),
    coordenador: document.getElementById("coordenador-dashboard"),
  };
let I = null,
  R = new Map(),
  U = new Map(),
  F = new Map(),
  y = null;
function f(a, e = "success") {
  const t = document.getElementById("notification-container"),
    o = document.createElement("div");
  ((o.className = `notification ${e}`),
    (o.textContent = a),
    t.appendChild(o),
    setTimeout(() => {
      t.contains(o) && t.removeChild(o);
    }, 3e3));
}
function j(a) {
  (Object.values(me).forEach((e) => e.classList.add("hidden")),
    document.getElementById("panel-chamada").classList.add("hidden"),
    me[a]?.classList.remove("hidden"),
    lucide.createIcons());
}
window.switchProfessorMode = ce;
window.carregarListaChamada = be;
window.salvarProfessor = async (a) => {
  const t = document.getElementById(`prof-input-${a}`).value;
  try {
    (await O(L(u, "disciplinas", a), { professor: t }),
      f("Professor atualizado!", "success"));
  } catch (o) {
    (console.error(o), f("Erro ao atualizar.", "error"));
  }
};
$e(P, async (a) => {
  if (a)
    try {
      const e = L(u, "utilizadores", a.uid),
        t = await _(e);
      if (t.exists()) {
        ((I = { id: a.uid, ...t.data() }), await Me());
        const o = I.cursos || [];
        if (o.length === 0) {
          (j("login"),
            (document.getElementById("login-error").textContent =
              "Não está associado a nenhum curso. Contacte o suporte."),
            document.getElementById("login-error").classList.remove("hidden"),
            z(P));
          return;
        }
        o.length === 1 ? ((y = o[0]), ie(I.role, y)) : Se(o);
      } else
        (j("login"),
          (document.getElementById("login-error").textContent =
            "Perfil de utilizador não configurado. Contacte o suporte."),
          document.getElementById("login-error").classList.remove("hidden"),
          z(P));
    } catch (e) {
      (console.error("Erro ao buscar perfil do utilizador:", e),
        j("login"),
        (document.getElementById("login-error").textContent =
          "Erro ao carregar dados. Tente novamente."),
        document.getElementById("login-error").classList.remove("hidden"),
        z(P));
    }
  else ((I = null), (y = null), j("login"));
});
async function Me() {
  if (F.size > 0) return;
  (await D(C(u, "cursos"))).forEach((e) => {
    F.set(e.id, e.data());
  });
}
function Se(a) {
  const e = document.getElementById("curso-list");
  ((e.innerHTML = ""),
    a.forEach((t) => {
      const o = F.get(t);
      if (o) {
        const s = document.createElement("button");
        ((s.className =
          "w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition"),
          (s.textContent = o.nome),
          (s.onclick = () => {
            ((y = t), ie(I.role, y));
          }),
          e.appendChild(s));
      }
    }),
    j("cursoSelection"));
}
async function ie(a, e) {
  const t = I.nome || I.cpf || "Utilizador",
    o = F.get(e),
    s = o?.nome || "Curso não encontrado";
  (await Z(e),
    j(a),
    Ke(),
    document.body
      .querySelectorAll('[id$="-logout"]')
      .forEach((r) => (r.onclick = () => z(P))));
  const n = o?.ferramentas || [];
  switch (a) {
    case "aluno":
      ((document.getElementById("aluno-nome").textContent = t),
        (document.getElementById("aluno-curso-nome").textContent = s),
        ae(n, "aluno-ferramentas-container", "aluno"),
        je(P.currentUser.uid, e, I),
        Pe(P.currentUser.uid, e),
        He(e),
        Ge(e),
        se(I.financeiro || []));
      // Load email de contato
      if (typeof carregarEmailAluno === 'function') setTimeout(carregarEmailAluno, 500);
      break;
    case "professor":
      ((document.getElementById("professor-nome").textContent = t),
        (document.getElementById("professor-curso-nome").textContent = s),
        ae(n, "professor-ferramentas-container", "professor"));
      const r = document.getElementById("professor-ferramentas-container");
      if (r) {
        const i = document.createElement("button");
        ((i.className =
          "w-full mb-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 flex items-center gap-3 transition border border-indigo-200 text-left"),
          (i.innerHTML =
            '<div class="p-1 bg-indigo-200 rounded-md"><i data-lucide="bar-chart-2" class="w-4 h-4"></i></div> Minhas Turmas (Relatório)'),
          (i.onclick = () => {
            document
              .getElementById("professor-dashboard")
              .classList.add("hidden");
            const c = document.getElementById("panel-relatorio-coord");
            c.classList.remove("hidden");
            const l = c.querySelector("button");
            (l &&
              (l.onclick = () => {
                (c.classList.add("hidden"),
                  document
                    .getElementById("professor-dashboard")
                    .classList.remove("hidden"));
              }),
              Ee(y, P.currentUser.uid));
          }),
          r.insertBefore(i, r.firstChild),
          lucide.createIcons());
      }
      (V("prof", e),
        J("prof"),
        J("chamada"),
        ce("notas"),
        (document.getElementById("data-chamada").valueAsDate = new Date()));
      break;
    case "coordenador":
      ((document.getElementById("coordenador-curso-nome").textContent = s),
        ae(n, "coordenador-ferramentas-container", "coordenador"),
        ke(e),
        ze(e),
        Fe(e),
        V("coord", e),
        J("coord"),
        ye(e));
      const d = document.getElementById("aluno-select-ficha");
      (d &&
        ((d.innerHTML = '<option value="">Carregando...</option>'),
          V("ficha", e)),
        Oe());
      // Populate document upload selects
      if (typeof popularDocumentosSelects === 'function') setTimeout(popularDocumentosSelects, 800);
      break;
  }
}
function ce(a) {
  const e = document.getElementById("btn-mode-notas"),
    t = document.getElementById("btn-mode-chamada"),
    o = document.getElementById("panel-notas"),
    s = document.getElementById("panel-chamada"),
    n = document.getElementById("professor-dashboard");
  if (a === "notas")
    (n.classList.remove("hidden"),
      o.classList.remove("hidden"),
      s.classList.add("hidden"),
      e.classList.add("bg-white", "text-indigo-600", "shadow-sm"),
      e.classList.remove("text-gray-500"),
      t.classList.remove("bg-white", "text-teal-600", "shadow-sm"),
      t.classList.add("text-gray-500"));
  else {
    (n.classList.add("hidden"),
      s.classList.remove("hidden"),
      t.classList.add("bg-white", "text-teal-600", "shadow-sm"),
      t.classList.remove("text-gray-500"),
      e.classList.remove("bg-white", "text-indigo-600", "shadow-sm"),
      e.classList.add("text-gray-500"),
      (document.getElementById("data-chamada").valueAsDate = new Date()));
    const r = document.getElementById("chamada-voltar-container");
    r.innerHTML = "";
    const d = document.createElement("button");
    ((d.className =
      "text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold transition"),
      (d.innerHTML =
        '<i data-lucide="arrow-left" class="w-4 h-4"></i> Voltar ao Painel'),
      (d.onclick = () => {
        (document.getElementById("panel-chamada").classList.add("hidden"),
          ce("notas"));
      }),
      r.appendChild(d),
      lucide.createIcons());
  }
}
function ae(a, e, t) {
  const o = document.getElementById(e);
  if (!o) return;
  o.innerHTML = "";
  const s = a.filter((n) => !n.perfil || n.perfil.includes(t));
  if (s.length === 0) {
    o.innerHTML =
      '<p class="col-span-full text-gray-500">Nenhuma ferramenta configurada para este curso.</p>';
    return;
  }
  (s.forEach((n) => {
    const r = document.createElement("a");
    ((r.href = n.url), (r.target = "_blank"));
    const d = n.icone || n.icon || "link";
    (e.includes("coordenador") || e.includes("professor")
      ? ((r.className =
        "flex items-center gap-3 p-3 bg-white/50 hover:bg-white border border-gray-200 rounded-xl transition group text-decoration-none"),
        (r.innerHTML = `
                <div class="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition"><i data-lucide="${d}" class="w-5 h-5"></i></div>
                <span class="font-medium text-gray-700 text-left group-hover:text-purple-700 transition">${n.titulo}</span>
            `))
      : ((r.className =
        "flex flex-col items-center justify-center p-4 bg-white/50 hover:bg-white border border-gray-200 rounded-2xl transition hover:shadow-md group text-decoration-none"),
        (r.innerHTML = `
                <i data-lucide="${d}" class="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition"></i>
                <span class="font-semibold text-xs text-gray-600 group-hover:text-indigo-600 text-center leading-tight px-1">${n.titulo}</span>
            `)),
      o.appendChild(r));
  }),
    lucide.createIcons());
}
async function be() {
  const a = document.getElementById("disciplina-select-chamada").value,
    e = document.getElementById("lista-chamada-container"),
    t = y;
  if (!a) {
    e.innerHTML =
      '<p class="p-8 text-center text-gray-400">Selecione uma disciplina.</p>';
    return;
  }
  e.innerHTML =
    '<p class="p-8 text-center text-gray-400">Carregando alunos e histórico...</p>';
  let o = [],
    s = {};
  try {
    // Check if a turma is selected
    const turmaSelect = document.getElementById('turma-select-chamada');
    const turmaId = turmaSelect ? turmaSelect.value : '';
    let alunosFiltro = null;

    if (turmaId) {
      // Load only students from the selected turma
      const turmaDoc = await _(L(u, 'turmas', turmaId));
      if (turmaDoc.exists()) {
        alunosFiltro = new Set(turmaDoc.data().alunos || []);
      }
    }

    const [r, d] = await Promise.all([
      D(
        $(
          C(u, "utilizadores"),
          v("role", "==", "aluno"),
          v("cursos", "array-contains", t),
        ),
      ),
      D($(C(u, "notas"), v("cursoId", "==", t), v("disciplina", "==", a))),
    ]);
    r.forEach((c) => {
      const alunoData = { id: c.id, ...c.data() };
      // If turma filter active, only include students from that turma
      if (alunosFiltro && !alunosFiltro.has(c.id)) return;
      o.push(alunoData);
    });
    o.sort((c, l) => (c.nome || "").localeCompare(l.nome || ""));
    const i = document.getElementById("data-chamada").value;
    i &&
      d.forEach((c) => {
        const l = c.data();
        l.chamadas && l.chamadas[i] && (s[l.alunoUid] = l.chamadas[i]);
      });
  } catch (r) {
    if (
      (console.error("Erro ao carregar dados da chamada:", r), o.length === 0)
    ) {
      e.innerHTML = `<div class="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
                        <p class="font-bold">Erro de conexão.</p>
                        <p class="text-xs mt-1">${r.message}</p>
                    </div>`;
      return;
    }
  }
  if (o.length === 0) {
    e.innerHTML =
      '<p class="p-8 text-center text-gray-400">Nenhum aluno nesta turma.</p>';
    return;
  }
  ((e.innerHTML = ""),
    o.forEach((r) => {
      const d = s[r.id] === "P" || !s[r.id],
        i = document.createElement("div");
      ((i.className =
        "flex items-center justify-between p-4 hover:bg-teal-50/30 transition"),
        (i.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">${(r.nome || "??").substring(0, 2).toUpperCase()}</div>
                        <span class="font-medium text-gray-700">${r.nome}</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="presenca_${r.id}" class="sr-only peer" ${d ? "checked" : ""}>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                `),
        e.appendChild(i));
    }));
  const n = document.getElementById("historico-datas-chamada");
  if (n) {
    n.innerHTML = "";
    const r = new Set();
    if (
      (notasSnap.forEach((d) => {
        const i = d.data().chamadas || {};
        Object.keys(i).forEach((c) => r.add(c));
      }),
        r.size > 0)
    ) {
      const d = Array.from(r).sort().reverse(),
        i = document.createElement("p");
      ((i.className =
        "text-xs font-bold text-gray-500 mb-2 mt-4 uppercase tracking-wider"),
        (i.textContent = "Histórico de Chamadas lançadas:"),
        n.appendChild(i));
      const c = document.createElement("div");
      ((c.className = "flex flex-wrap gap-2"),
        d.forEach((l) => {
          const w = document.createElement("button");
          ((w.type = "button"),
            (w.className =
              "px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100 hover:bg-teal-100 hover:border-teal-300 transition"),
            (w.textContent = l.split("-").reverse().join("/")),
            (w.onclick = () => {
              ((document.getElementById("data-chamada").value = l), be());
            }),
            c.appendChild(w));
        }),
        n.appendChild(c));
    } else
      n.innerHTML =
        '<p class="text-xs text-gray-400 mt-2">Nenhuma chamada anterior encontrada para esta disciplina.</p>';
  }
  lucide.createIcons();
}
document
  .getElementById("chamada-form-prof")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = document.getElementById("disciplina-select-chamada").value,
      t = document.getElementById("data-chamada").value;
    if (!e || !t) return f("Preencha todos os campos da chamada.", "error");
    const o = document.querySelectorAll(
      '#lista-chamada-container input[name^="presenca_"]',
    );
    try {
      const s = De(u);
      let n = 0;
      (o.forEach((r) => {
        const d = r.name.split("_")[1],
          i = r.checked ? "P" : "F",
          c = `${d}_${e.replace(/\s+/g, "-")}`,
          l = L(u, "notas", c);
        (s.set(
          l,
          {
            alunoUid: d,
            disciplina: e,
            cursoId: y,
            chamadas: { [t]: i },
            atualizadaEm: H(),
          },
          { merge: !0 },
        ),
          n++);
      }),
        n > 0 && (await s.commit()),
        f(`Chamada do dia ${t} salva (Sincronizada com Notas)!`, "success"));
    } catch (s) {
      console.error("Erro salvar chamada (Batch):", s);
      let n = "Erro ao salvar chamada.";
      (s.code === "permission-denied" &&
        (n = "Erro: Sem permissão para atualizar registros."),
        f(n + " " + s.message, "error"));
    }
  });
document.getElementById("login-form").addEventListener("submit", async (a) => {
  a.preventDefault();
  const e = document.getElementById("login-error"),
    t = document.getElementById("login-button"),
    o = document.getElementById("login-button-text");
  (e.classList.add("hidden"),
    (t.disabled = !0),
    (o.textContent = "Aguarde..."));
  try {
    const s = document.getElementById("cpf").value,
      n = document.getElementById("password").value,
      r = s.replace(/\D/g, "");
    if (r.length !== 11) {
      ((e.textContent = "Formato de CPF inválido."),
        e.classList.remove("hidden"));
      return;
    }
    const d = `cpf.${r}@rac.portal`;
    await Le(P, d, n);
  } catch (s) {
    (console.error("Erro de login:", s.code),
      s.code === "auth/user-not-found" ||
        s.code === "auth/wrong-password" ||
        s.code === "auth/invalid-credential"
        ? (e.textContent = "CPF ou senha inválidos.")
        : (e.textContent = "Ocorreu um erro. Tente novamente."),
      e.classList.remove("hidden"));
  } finally {
    ((t.disabled = !1), (o.textContent = "Entrar"));
  }
});
document
  .getElementById("requerimento-form")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = a.target,
      t = e.querySelector('button[type="submit"]');
    t.disabled = !0;
    try {
      const o = document.getElementById("requerimento-assunto").value,
        s = document.getElementById("requerimento-mensagem").value;
      const nomeAluno = I.nome || I.cpf;
      await de(C(u, "requerimentos"), {
        assunto: o,
        mensagem: s,
        enviadoEm: H(),
        alunoUid: P.currentUser.uid,
        alunoNome: nomeAluno,
        cursoId: y,
        status: "Pendente",
        resposta: "",
        respondidoEm: null,
      });
      e.reset();
      f("Requerimento enviado com sucesso!", "success");
      notificarRequerimentoEnviado(o, s, nomeAluno).catch(err => console.warn('Notif:', err));
    } catch (o) {
      (console.error("Erro ao enviar requerimento: ", o),
        f("Erro ao enviar requerimento.", "error"));
    } finally {
      t.disabled = !1;
    }
  });
document
  .getElementById("comunicado-form")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = a.target,
      t = e.querySelector('button[type="submit"]');
    t.disabled = !0;
    try {
      const o = document.getElementById("comunicado-titulo").value,
        s = document.getElementById("comunicado-mensagem").value;
      (await de(C(u, "comunicados"), {
        titulo: o,
        mensagem: s,
        publicadoEm: H(),
        autor: I.nome || "Coordenação",
        cursoId: y,
      }),
        e.reset(),
        f("Comunicado publicado!", "success"));
    } catch (o) {
      (console.error("Erro ao publicar comunicado:", o),
        f("Erro ao publicar comunicado.", "error"));
    } finally {
      t.disabled = !1;
    }
  });
async function Ae(a, e, statusFinal) {
  const t = L(u, "requerimentos", a);
  const finalStatus = statusFinal || 'Deferido';
  try {
    const reqDoc = await _(t);
    const reqData = reqDoc.exists() ? reqDoc.data() : {};

    await O(t, { resposta: e, status: finalStatus, respondidoEm: H() });
    f(`Requerimento ${finalStatus.toLowerCase()} com sucesso.`, "success");

    // Notificar aluno por email
    if (reqData.alunoUid) {
      notificarRequerimentoRespondido(reqData.alunoUid, reqData.assunto || 'Requerimento', e)
        .catch(err => console.warn('Notif resp falhou:', err));
    }
  } catch (o) {
    console.error("Erro ao responder requerimento:", o);
    f("Erro ao enviar resposta.", "error");
  }
}
function xe(a) {
  document.getElementById(a)?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = e.target,
      o = t.querySelector('button[type="submit"]');
    o.disabled = !0;
    try {
      const s = a.includes("prof") ? "-prof" : "-coord",
        n = document.getElementById(`disciplina-select${s}`).value,
        r = document.getElementById(`aluno-select${s}`).value,
        d = parseFloat(document.getElementById(`nota-input${s}`).value);
      if (isNaN(d) || d < 0 || d > 10 || !r || !n) {
        f("Por favor, preencha todos os campos corretamente.", "error");
        return;
      }
      const i = `${r}_${n.replace(/\s+/g, "-")}`;
      (await Y(L(u, "notas", i), {
        alunoUid: r,
        disciplina: n,
        nota: d,
        cursoId: y,
        atualizadaEm: H(),
        lancadoPor: I.nome || "Usuário Desconhecido",
      }),
        t.reset(),
        f("Nota lançada com sucesso!", "success"),
        // Notificar aluno por email (best-effort, não bloqueia)
        notificarNotaPorEmail(r, n, d).catch(e => console.warn('Notificação falhou:', e)));
    } catch (s) {
      (console.error("Erro ao lançar nota: ", s),
        f("Erro ao lançar nota.", "error"));
    } finally {
      o.disabled = !1;
    }
  });
}
xe("lancar-nota-form-prof");
xe("lancar-nota-form-coord");
async function le() {
  if (R.size > 0) return;
  R.clear();
  const a = $(C(u, "utilizadores"), v("role", "==", "aluno"));
  (await D(a)).forEach((t) => {
    R.set(t.id, t.data());
  });
}
async function Z(a) {
  U.clear();
  const e = $(C(u, "disciplinas"), v("cursoId", "==", a));
  (await D(e)).forEach((o) => {
    U.set(o.id, { id: o.id, ...o.data() });
  });
}
async function V(a, e) {
  const t = document.getElementById(`aluno-select-${a}`);
  if (!t) return;
  t.innerHTML = '<option value="">Selecione um aluno</option>';
  const o = $(
    C(u, "utilizadores"),
    v("role", "==", "aluno"),
    v("cursos", "array-contains", e),
  ),
    s = await D(o),
    n = [];
  (s.forEach((r) => {
    n.push({ id: r.id, ...r.data() });
  }),
    n.sort((r, d) =>
      (r.nome || r.cpf || "").localeCompare(d.nome || d.cpf || ""),
    ),
    n.length === 0
      ? (t.innerHTML = "<option>Nenhum aluno encontrado neste curso</option>")
      : n.forEach((r) => {
        const d = r.nome || r.cpf;
        const cpfF = r.cpf ? r.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
        const label = a === 'ficha' && cpfF ? `${d} — ${cpfF}` : d;
        t.innerHTML += `<option value="${r.id}">${label}</option>`;
      }));
}
async function J(a, e) {
  const t = document.getElementById(`disciplina-select-${a}`);
  if (!t) return;
  t.innerHTML = '<option value="">Selecione a disciplina</option>';
  const o = Array.from(U.values());
  (o.sort((s, n) => s.nome.localeCompare(n.nome)),
    o.length === 0
      ? (t.innerHTML =
        "<option>Nenhuma disciplina encontrada para este curso</option>")
      : o.forEach((s) => {
        t.innerHTML += `<option value="${s.nome}">${s.nome}</option>`;
      }));
}
async function ye(a) {
  const e = document.getElementById("lista-disciplinas-professores");
  if (!e) return;
  ((e.innerHTML = '<p class="text-gray-500 text-sm">Carregando...</p>'),
    U.size === 0 && (await Z(a)));
  const t = Array.from(U.values());
  if ((t.sort((o, s) => o.nome.localeCompare(s.nome)), t.length === 0)) {
    e.innerHTML =
      '<p class="text-gray-500 text-sm">Nenhuma disciplina cadastrada para este curso.</p>';
    return;
  }
  ((e.innerHTML = ""),
    t.forEach((o) => {
      const s = document.createElement("div");
      ((s.className =
        "flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2"),
        (s.innerHTML = `
                    <span class="font-medium text-sm flex-1">${o.nome}</span>
                    <div class="flex gap-2 flex-1">
                        <input type="text"
                               value="${o.professor || ""}"
                               placeholder="Nome do Professor"
                               class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-purple-500"
                               id="prof-input-${o.id}">
                        <button class="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                                onclick="window.salvarProfessor('${o.id}')"
                                title="Salvar">
                            <i data-lucide="save" class="w-4 h-4"></i>
                        </button>
                        <button class="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition"
                                onclick="window.excluirDisciplina('${o.id}')"
                                title="Excluir">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                `),
        e.appendChild(s));
    }),
    lucide.createIcons());
}
window.excluirDisciplina = async (a) => {
    if (!confirm("Deseja excluir esta disciplina?")) return;
    try {
        await Ne(L(u, "disciplinas", a));
        await Z(y);
        ye(y);
        J("coord", y);
        f("Disciplina excluída com sucesso!", "success");
    } catch (o) {
        console.error("Erro ao excluir disciplina:", o);
        f("Erro ao excluir disciplina.", "error");
    }
};
window.salvarProfessor = async (a) => {
  const t = document.getElementById(`prof-input-${a}`).value;
  try {
    (await O(L(u, "disciplinas", a), { professor: t }),
      await Z(y),
      f("Professor atualizado com sucesso!", "success"));
  } catch (o) {
    (console.error("Erro ao atualizar professor:", o),
      f("Erro ao atualizar professor.", "error"));
  }
};
function Pe(a, e) {
  const t = document.getElementById("meus-requerimentos-container");
  if (!t) return;
  const o = $(
    C(u, "requerimentos"),
    v("alunoUid", "==", a),
    v("cursoId", "==", e),
  );
  Q(
    o,
    (s) => {
      const n = s.docs.map((d) => d.data());
      (n.sort((d, i) => {
        const c = d.enviadoEm?.seconds || 0;
        return (i.enviadoEm?.seconds || 0) - c;
      }),
        (t.innerHTML =
          n.length === 0
            ? '<p class="text-gray-500">Você ainda não abriu nenhum requerimento.</p>'
            : ""));
      const r = {
        Pendente: "border-yellow-400 bg-yellow-50",
        Analisando: "border-blue-400 bg-blue-50",
        Deferido: "border-green-400 bg-green-50",
        Indeferido: "border-red-400 bg-red-50",
        Resolvido: "border-green-400 bg-green-50",
      };
      const statusIcon = {
        Pendente: "🟡",
        Analisando: "🔵",
        Deferido: "🟢",
        Indeferido: "🔴",
        Resolvido: "🟢",
      };
      n.forEach((d) => {
        const i = d.status || "Pendente",
          c = r[i] || "border-gray-400 bg-gray-50",
          l = d.enviadoEm
            ? new Date(d.enviadoEm.seconds * 1e3).toLocaleDateString("pt-BR")
            : "";
        let w = "";
        if ((d.status === "Deferido" || d.status === "Indeferido" || d.status === "Resolvido") && d.resposta) {
          const b = d.respondidoEm
            ? new Date(d.respondidoEm.seconds * 1e3).toLocaleDateString("pt-BR")
            : "";
          const respColor = d.status === "Indeferido" ? "red" : "green";
          w = `
                            <div class="mt-4 pt-3 border-t border-${respColor}-200">
                                <h5 class="font-bold text-sm text-${respColor}-800">Resposta da Coordenação:</h5>
                                <p class="text-sm text-gray-700 whitespace-pre-wrap">${d.resposta}</p>
                                <p class="text-xs text-gray-500 text-right mt-1">Em: ${b}</p>
                            </div>`;
        }
        t.innerHTML += `
                        <div class="p-4 rounded-lg border-l-4 ${c} requerimento-card">
                            <div class="flex justify-between items-start">
                                <h4 class="font-bold">${d.assunto}</h4>
                                <span class="text-xs font-semibold px-2 py-1 rounded-full ${c.replace("border-", "bg-").replace("-400", "-200")}">${statusIcon[i] || "⚪"} ${i}</span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1 whitespace-pre-wrap">${d.mensagem}</p>
                            <p class="text-xs text-gray-400 text-right mt-2">Enviado em: ${l}</p>
                            ${w}
                        </div>`;
      });
    },
    (s) => {
      (console.error("Erro ao carregar requerimentos:", s),
        (t.innerHTML =
          '<p class="text-red-500">Erro ao carregar seus requerimentos.</p>'));
    },
  );
}
function ke(a) {
  const e = document.getElementById("requerimentos-container-coord");
  if (!e) return;
  const t = $(C(u, "requerimentos"), v("cursoId", "==", a));
  Q(t, (o) => {
    const s = o.docs.map((n) => ({ id: n.id, ...n.data() }));
    (s.sort(
      (n, r) => (r.enviadoEm?.seconds || 0) - (n.enviadoEm?.seconds || 0),
    ),
      (e.innerHTML =
        s.length === 0
          ? '<p class="text-gray-500">Nenhum requerimento recebido para este curso.</p>'
          : ""),
      s.forEach((n) => {
        const r = n.id,
          d = n.enviadoEm
            ? new Date(n.enviadoEm.seconds * 1e3).toLocaleString("pt-BR")
            : "",
          i = n.status === "Deferido" || n.status === "Indeferido" || n.status === "Resolvido",
          c = document.createElement("div");
        const borderColor = { Pendente: 'border-yellow-400', Analisando: 'border-blue-400', Deferido: 'border-green-400', Indeferido: 'border-red-400', Resolvido: 'border-green-400' }[n.status] || 'border-gray-400';
        ((c.className =
          `p-4 bg-white rounded-lg border-l-4 ${borderColor} shadow-sm requerimento-card`),
          (c.innerHTML = `
                         <div class="flex justify-between items-start gap-4">
                             <div>
                                 <h4 class="font-bold text-lg">${n.assunto}</h4>
                                 <p class="text-sm font-semibold text-gray-700">De: ${n.alunoNome || "Aluno anónimo"}</p>
                                 <p class="text-xs text-gray-500">${d}</p>
                             </div>
                             <div class="w-44 flex-shrink-0">
                                 <label for="status-${r}" class="text-xs font-medium text-gray-500">Status:</label>
                                 <select id="status-${r}" data-docid="${r}" class="status-select w-full p-1.5 border rounded-md text-sm font-bold" ${i ? "disabled" : ""}>
                                     <option value="Pendente" ${n.status === "Pendente" ? "selected" : ""}>🟡 Pendente</option>
                                     <option value="Analisando" ${n.status === "Analisando" ? "selected" : ""}>🔵 Em Análise</option>
                                     <option value="Deferido" ${n.status === "Deferido" ? "selected" : ""} ${i ? '' : ''}>🟢 Deferido</option>
                                     <option value="Indeferido" ${n.status === "Indeferido" ? "selected" : ""} ${i ? '' : ''}>🔴 Indeferido</option>
                                 </select>
                             </div>
                         </div>
                         <p class="mt-3 text-gray-800 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">${n.mensagem}</p>

                         <div class="mt-4">
                             ${i && n.resposta
              ? `
                                 <div>
                                     <h5 class="font-bold text-sm text-green-800">Sua Resposta:</h5>
                                     <p class="text-sm bg-green-50 p-3 rounded-md whitespace-pre-wrap">${n.resposta}</p>
                                 </div>
                             `
              : `
                                 <form class="responder-form" data-docid="${r}">
                                     <label for="resposta-${r}" class="block text-sm font-medium mb-1">Responder ao aluno:</label>
                                     <textarea id="resposta-${r}" class="w-full p-2 border rounded-lg text-sm" rows="3" required></textarea>
                                     <button type="submit" class="mt-2 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition">Enviar Resposta</button>
                                 </form>
                             `
            }
                         </div>
                     `),
          e.appendChild(c));
      }));
  });
}
document
  .getElementById("coordenador-dashboard")
  .addEventListener("change", (a) => {
    if (a.target.classList.contains("status-select")) {
      const e = a.target.dataset.docid,
        t = a.target.value;
      O(L(u, "requerimentos", e), { status: t });
    }
  });
document
  .getElementById("coordenador-dashboard")
  .addEventListener("submit", (a) => {
    if (a.target.classList.contains("responder-form")) {
      a.preventDefault();
      const e = a.target.dataset.docid,
        t = a.target.querySelector("textarea").value;
      // Get selected status from the corresponding select
      const statusSelect = document.getElementById(`status-${e}`);
      const status = statusSelect ? statusSelect.value : 'Deferido';
      Ae(e, t, status);
    }
  });
function He(a) {
  const e = document.getElementById("comunicados-container-aluno");
  if (!e) return;
  const t = $(C(u, "comunicados"), v("cursoId", "==", a));
  Q(t, (o) => {
    const s = o.docs.map((n) => n.data());
    (s.sort(
      (n, r) => (r.publicadoEm?.seconds || 0) - (n.publicadoEm?.seconds || 0),
    ),
      (e.innerHTML =
        s.length === 0
          ? '<p class="text-gray-500">Nenhum comunicado no momento.</p>'
          : ""),
      s.forEach((n) => {
        const r = n.publicadoEm
          ? new Date(n.publicadoEm.seconds * 1e3).toLocaleDateString("pt-BR")
          : "";
        e.innerHTML += `
                        <div class="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-md">${n.titulo}</h4>
                                <span class="text-xs text-gray-500">${r}</span>
                            </div>
                            <p class="mt-2 text-sm">${n.mensagem}</p>
                        </div>
                    `;
      }));
  });
}
function Fe(a) {
  const e = document.getElementById("gerenciar-comunicados-container");
  if (!e) return;
  const t = $(C(u, "comunicados"), v("cursoId", "==", a));
  Q(t, (o) => {
    const s = o.docs.map((n) => ({ id: n.id, ...n.data() }));
    (s.sort(
      (n, r) => (r.publicadoEm?.seconds || 0) - (n.publicadoEm?.seconds || 0),
    ),
      (e.innerHTML =
        s.length === 0
          ? '<p class="text-gray-500">Nenhum comunicado ativo para este curso.</p>'
          : ""),
      s.forEach((n) => {
        const r = n.id,
          d = n.publicadoEm
            ? new Date(n.publicadoEm.seconds * 1e3).toLocaleDateString("pt-BR")
            : "",
          i = document.createElement("div");
        ((i.className =
          "p-3 bg-gray-50 rounded-lg flex justify-between items-center"),
          (i.innerHTML = `
                        <div>
                            <p class="font-semibold text-sm">${n.titulo}</p>
                            <p class="text-xs text-gray-500">Publicado em: ${d}</p>
                        </div>
                        <button data-docid="${r}" class="delete-comunicado-btn text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    `),
          e.appendChild(i));
      }),
      lucide.createIcons());
  });
}
async function qe(a) {
  (await Re("Tem certeza que deseja excluir este comunicado?")) &&
    (await Ne(L(u, "comunicados", a)), f("Comunicado excluído.", "success"));
}
function Re(a) {
  return new Promise((e) => {
    const t = document.createElement("div");
    ((t.style.cssText =
      "position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;"),
      (t.innerHTML = `
                    <div style="background:white; padding:2rem; border-radius:0.5rem; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <p style="margin-bottom:1.5rem; font-size: 1.1rem;">${a}</p>
                        <button id="confirm-yes" style="background:#dc2626; color:white; padding:0.5rem 1.5rem; border:none; border-radius:0.25rem; margin-right:1rem; cursor:pointer;">Sim, excluir</button>
                        <button id="confirm-no" style="background:#e5e7eb; padding:0.5rem 1.5rem; border:none; border-radius:0.25rem; cursor:pointer;">Não</button>
                    </div>
                `),
      document.body.appendChild(t),
      (document.getElementById("confirm-yes").onclick = () => {
        (document.body.removeChild(t), e(!0));
      }),
      (document.getElementById("confirm-no").onclick = () => {
        (document.body.removeChild(t), e(!1));
      }));
  });
}
document
  .getElementById("coordenador-dashboard")
  .addEventListener("click", (a) => {
    const e = a.target.closest(".delete-comunicado-btn");
    if (e) {
      const t = e.dataset.docid;
      qe(t);
    }
  });
function je(a, e, t) {
  const o = document.getElementById("notas-tbody");
  if (!o) return;
  o.innerHTML =
    '<tr><td colspan="5" class="text-center p-8 text-gray-400">Carregando suas notas...</td></tr>';
  const s = $(C(u, "notas"), v("alunoUid", "==", a), v("cursoId", "==", e));
  Q(
    s,
    async (n) => {
      try {
        const r = {};
        n.forEach((b) => {
          r[b.data().disciplina] = b.data().nota;
        });
        const d = $(C(u, "disciplinas"), v("cursoId", "==", e)),
          i = await D(d),
          c = [];
        i.forEach((b) => {
          c.push({ id: b.id, ...b.data() });
        });

        // Fetch turmas to get period info for the student
        let turmasDoAluno = [];
        try {
          const turmasSnap = await D($(C(u, 'turmas'), v('cursoId', '==', e)));
          turmasSnap.forEach(td => {
            const tData = td.data();
            if ((tData.alunos || []).includes(a)) {
              turmasDoAluno.push({ id: td.id, ...tData });
            }
          });
        } catch (te) { console.warn('Turmas not available', te); }

        // Build period filter buttons
        const periodoContainer = document.getElementById('aluno-filtro-periodo-container');
        if (periodoContainer) {
          const periodos = [...new Set(turmasDoAluno.map(t2 => t2.periodo).filter(Boolean))];
          periodos.sort();
          periodoContainer.innerHTML = '<button onclick="filtrarNotasAluno(\'todos\')" id="filtro-periodo-todos" class="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">Todos</button>';
          periodos.forEach(p => {
            periodoContainer.innerHTML += `<button onclick="filtrarNotasAluno('${p}')" class="filtro-periodo-btn px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500 border border-gray-200">${p}</button>`;
          });
        }

        // Map discipline -> turma period
        const discPeriodo = {};
        turmasDoAluno.forEach(t2 => {
          if (t2.disciplinaNome) discPeriodo[t2.disciplinaNome] = t2.periodo || '';
        });

        const l = {},
          w = {};
        (n.forEach((b) => {
          const m = b.data(),
            x = m.disciplina;
          (l[x] || ((l[x] = 0), (w[x] = 0)),
            m.chamadas &&
            (Object.values(m.chamadas).forEach((E) => {
              (l[x]++, E === "F" && w[x]++);
            }),
              window.detalhesFrequenciasTemp ||
              (window.detalhesFrequenciasTemp = {}),
              window.detalhesFrequenciasTemp[x] ||
              (window.detalhesFrequenciasTemp[x] = {}),
              (window.detalhesFrequenciasTemp[x] = m.chamadas)));
        }),
          (o.innerHTML = ""),
          c.length === 0
            ? (o.innerHTML =
              '<tr><td colspan="5" class="text-center p-4">Nenhuma disciplina cadastrada para este curso.</td></tr>')
            : (c.sort((b, m) => b.nome.localeCompare(m.nome)),
              c.forEach((b) => {
                const m = b.nome,
                  x = r[m] || 0,
                  E = w[m] || 0,
                  p = l[m] || 0,
                  g = p > 0 ? Math.round(((p - E) / p) * 100) : 100;
                let h =
                  '<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Cursando</span>';
                x > 0 &&
                  (x >= 7 && g >= 75
                    ? (h =
                      '<span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Aprovado</span>')
                    : x < 7
                      ? (h =
                        '<span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Reprovado (Nota)</span>')
                      : g < 75 &&
                      (h =
                        '<span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">Reprovado (Freq)</span>'));
                const B = document.createElement("tr");
                const periodo = discPeriodo[m] || '';
                B.className =
                  "hover:bg-purple-50/30 transition border-b border-gray-50";
                B.dataset.periodo = periodo;
                const N = window.detalhesFrequenciasTemp
                  ? window.detalhesFrequenciasTemp[m]
                  : {};
                ((B.innerHTML = `
                        <td class="p-4 font-medium text-gray-700">${m}</td>
                        <td class="p-4 text-center"><span class="px-2 py-0.5 text-xs font-bold rounded-full ${periodo ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}">${periodo || '—'}</span></td>
                        <td class="p-4 text-center font-bold text-gray-800">${x > 0 ? x.toFixed(1) : "-"}</td>
                        <td class="p-4 text-center text-sm text-gray-600">
                             <div class="flex flex-col items-center">
                                <span class="font-bold">${g}%</span>
                                <button onclick='verDetalhesFrequencia("${m}", ${JSON.stringify(N || {})})' class="text-xs text-purple-600 underline hover:text-purple-800 cursor-pointer mt-1">Ver histórico</button>
                             </div>
                        </td>
                        <td class="p-4 text-center">${h}</td>
                    `),
                  o.appendChild(B));
              })),
          t && t.financeiro ? se(t.financeiro) : se([]));
      } catch (r) {
        console.error("Erro processar notas:", r);
      }
    },
    (n) => {
      (console.error("Erro listener notas:", n),
        (o.innerHTML =
          '<tr><td colspan="4" class="text-center p-4 text-red-500">Erro de conexão ao carregar notas.</td></tr>'));
    },
  );
}
function se(a) {
  const e = document.getElementById("financeiro-container");
  e &&
    ((e.innerHTML = ""),
      (!a || a.length === 0) &&
      (a = [
        {
          mes: "Fevereiro 2026",
          vencimento: "10/02/2026",
          status: "pendente",
          link: "#",
        },
        {
          mes: "Janeiro 2026",
          vencimento: "10/01/2026",
          status: "pago",
          link: "#",
        },
      ]),
      a.forEach((t) => {
        const o = document.createElement("div");
        (t.status === "pendente"
          ? ((o.className =
            "flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl mb-2"),
            (o.innerHTML = `
                <div>
                     <p class="text-sm font-bold text-red-800">Mensalidade ${t.mes}</p>
                     <p class="text-xs text-red-600">Venceu: ${t.vencimento}</p>
                 </div>
                 <a href="${t.link}" target="_blank" class="p-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 shadow-sm flex items-center justify-center" title="Baixar Boleto">
                     <i data-lucide="file-down" class="w-4 h-4"></i>
                 </a>
            `))
          : ((o.className =
            "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl opacity-60 mb-2"),
            (o.innerHTML = `
                 <div>
                     <p class="text-sm font-bold text-gray-600">Mensalidade ${t.mes}</p>
                     <p class="text-xs text-green-600 font-bold"><i data-lucide="check" class="w-3 h-3 inline"></i> Pago</p>
                 </div>
             `)),
          e.appendChild(o));
      }),
      lucide.createIcons());
}
async function ze(a) {
  const e = document.getElementById("turmas-container");
  if (!e) return;
  e.innerHTML = "<p>A analisar...</p>";
  const t = $(C(u, "notas"), v("cursoId", "==", a)),
    o = await D(t);
  if (o.empty) {
    e.innerHTML = "<p>Não há dados de notas para este curso.</p>";
    return;
  }
  const s = {};
  (o.forEach((n) => {
    const { disciplina: r, nota: d } = n.data();
    (s[r] || (s[r] = { notas: [], aprovados: 0, reprovados: 0 }),
      s[r].notas.push(d),
      d >= 6 ? s[r].aprovados++ : s[r].reprovados++);
  }),
    (e.innerHTML = ""));
  for (const n in s) {
    const r = s[n],
      d = r.notas.length,
      i = d > 0 ? (r.notas.reduce((l, w) => l + w, 0) / d).toFixed(1) : 0,
      c = document.createElement("div");
    ((c.className = "p-4 bg-gray-50 rounded-lg border-l-4 border-purple-400"),
      (c.innerHTML = `
                    <h4 class="font-bold text-lg">${n}</h4>
                    <div class="mt-2 flex flex-wrap justify-between items-center text-sm gap-2">
                        <span><i data-lucide="users" class="inline-block w-4 h-4 mr-1"></i>${d} Alunos</span>
                        <span><i data-lucide="graduation-cap" class="inline-block w-4 h-4 mr-1"></i>Média: <strong>${i}</strong></span>
                        <span class="text-green-600"><i data-lucide="check-circle" class="inline-block w-4 h-4 mr-1"></i>${r.aprovados}</span>
                        <span class="text-red-600"><i data-lucide="x-circle" class="inline-block w-4 h-4 mr-1"></i>${r.reprovados}</span>
                    </div>
                    <div class="mt-4 flex gap-2">
                        <button class="flex-1 text-sm bg-white border border-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 transition view-grades-btn" data-disciplina="${n}">Ver Notas</button>
                        <button class="flex-1 text-sm bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition generate-report-btn" data-disciplina="${n}">Gerar Relatório PDF</button>
                    </div>
                `),
      e.appendChild(c));
  }
  lucide.createIcons();
}
const X = document.getElementById("notas-modal");
X?.addEventListener("click", (a) => {
  (a.target === X || a.target.closest("#close-modal-btn")) &&
    X.classList.add("hidden");
});
document
  .getElementById("coordenador-dashboard")
  ?.addEventListener("click", (a) => {
    const e = a.target.closest(".view-grades-btn");
    e?.dataset.disciplina && Ue(e.dataset.disciplina);
    const t = a.target.closest(".generate-report-btn");
    if (t?.dataset.disciplina) {
      const n = t.innerHTML;
      ((t.innerHTML = "Gerando..."),
        (t.disabled = !0),
        Ve(t.dataset.disciplina).finally(() => {
          ((t.innerHTML = n), (t.disabled = !1));
        }));
    }
    const o = a.target.closest("#btn-gerar-ficha");
    if (o) {
      const r = document.getElementById("aluno-select-ficha").value;
      if (!r) {
        alert("Selecione um aluno para gerar a ficha.");
        return;
      }
      const d = o.innerHTML;
      ((o.innerHTML = "Gerando..."),
        (o.disabled = !0),
        Je(r, y).finally(() => {
          ((o.innerHTML = d), (o.disabled = !1));
        }));
    }
    if (a.target.closest("#btn-editar-aluno")) {
      const r = document.getElementById("aluno-select-ficha").value;
      if (!r) {
        alert("Selecione um aluno para editar.");
        return;
      }
      _e(r);
    }
  });
async function Ue(a) {
  const e = document.getElementById("modal-title"),
    t = document.getElementById("modal-notas-tbody");
  ((e.textContent = `Notas de ${a}`),
    (t.innerHTML =
      '<tr><td colspan="3" class="text-center p-4">A carregar...</td></tr>'),
    X.classList.remove("hidden"));
  const o = $(C(u, "notas"), v("disciplina", "==", a), v("cursoId", "==", y)),
    s = await D(o),
    n = [];
  (await le(),
    s.forEach((r) => {
      const d = r.data(),
        i = R.get(d.alunoUid);
      n.push({ ...d, alunoNome: i?.nome || "Não encontrado" });
    }),
    n.sort((r, d) => r.alunoNome.localeCompare(d.alunoNome)),
    (t.innerHTML = ""),
    n.length === 0
      ? (t.innerHTML =
        '<tr><td colspan="3" class="text-center p-4">Nenhum aluno nesta disciplina.</td></tr>')
      : n.forEach((r) => {
        const notaVal = r.nota != null ? r.nota : null,
          d = notaVal != null ? (notaVal >= 6 ? "Aprovado" : "Reprovado") : "Sem nota",
          i =
            d === "Aprovado"
              ? "bg-green-100 text-green-700"
              : d === "Reprovado" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600";
        t.innerHTML += `<tr class="border-b"><td class="p-2">${r.alunoNome}</td><td class="p-2">${notaVal != null ? notaVal.toFixed(1) : '-'}</td><td class="p-2"><span class="px-2 py-1 text-xs font-semibold rounded-full ${i}">${d}</span></td></tr>`;
      }));
}
function Oe() {
  const a = document.getElementById("editar-aluno-modal"),
    e = document.getElementById("close-editar-aluno-btn"),
    t = document.getElementById("cancel-editar-aluno-btn"),
    o = document.getElementById("editar-aluno-form"),
    s = () => a.classList.add("hidden");
  (e.addEventListener("click", s),
    t.addEventListener("click", s),
    o.addEventListener("submit", async (n) => {
      n.preventDefault();
      const r = document.getElementById("edit-aluno-id").value,
        d = {
          nome: document.getElementById("edit-nome").value,
          cpf: document.getElementById("edit-cpf").value,
          pai: document.getElementById("edit-pai").value,
          mae: document.getElementById("edit-mae").value,
          endereco: document.getElementById("edit-endereco").value,
          dataInicio: document.getElementById("edit-dataInicio").value,
          previsaoTermino: document.getElementById("edit-previsaoTermino")
            .value,
          orientadorTCC: document.getElementById("edit-orientadorTCC").value,
          tituloTCC: document.getElementById("edit-tituloTCC").value,
          dataDefesa: document.getElementById("edit-dataDefesa").value,
          emailContato: document.getElementById("edit-emailContato")?.value || '',
        };
      try {
        (await O(L(u, "utilizadores", r), d),
          f("Dados do aluno atualizados com sucesso!", "success"),
          s());
        const i = L(u, "utilizadores", r),
          c = await _(i);
        c.exists() && R.set(r, c.data());
      } catch (i) {
        (console.error("Erro ao atualizar aluno:", i),
          f("Erro ao atualizar dados.", "error"));
      }
    }));
}
async function _e(a) {
  const e = document.getElementById("editar-aluno-modal");
  try {
    const t = await _(L(u, "utilizadores", a));
    if (!t.exists()) {
      f("Aluno não encontrado.", "error");
      return;
    }
    const o = t.data();
    ((document.getElementById("edit-aluno-id").value = a),
      (document.getElementById("edit-nome").value = o.nome || ""),
      (document.getElementById("edit-cpf").value = o.cpf || ""),
      (document.getElementById("edit-pai").value = o.pai || ""),
      (document.getElementById("edit-mae").value = o.mae || ""),
      (document.getElementById("edit-endereco").value = o.endereco || ""),
      (document.getElementById("edit-dataInicio").value = o.dataInicio || ""),
      (document.getElementById("edit-previsaoTermino").value =
        o.previsaoTermino || ""),
      (document.getElementById("edit-orientadorTCC").value =
        o.orientadorTCC || ""),
      (document.getElementById("edit-tituloTCC").value = o.tituloTCC || ""),
      (document.getElementById("edit-dataDefesa").value = o.dataDefesa || ""),
      document.getElementById("edit-emailContato") && (document.getElementById("edit-emailContato").value = o.emailContato || ""),
      e.classList.remove("hidden"));
  } catch (t) {
    (console.error("Erro ao abrir editor:", t),
      f("Erro ao carregar dados do aluno.", "error"));
  }
}
function Ge(a) {
  const e = document.getElementById("documento-modal"),
    t = document.getElementById("gerar-declaracao-btn"),
    o = document.getElementById("gerar-historico-btn"),
    s = document.getElementById("close-documento-btn"),
    n = document.getElementById("print-documento-btn"),
    r = document.getElementById("documento-overlay"),
    d = document.getElementById("documento-content"),
    i = () => e.classList.add("hidden");
  (s.addEventListener("click", i),
    r.addEventListener("click", i),
    t.addEventListener("click", async () => {
      if (!I) return;
      // Check for custom declaration PDF first
      try {
        const customUrl = await getDeclaracaoCustomURL();
        if (customUrl) {
          window.open(customUrl, '_blank');
          f('Declaração personalizada aberta em nova aba.', 'success');
          return;
        }
      } catch (ce) { console.warn('Custom declaration check failed', ce); }
      // Fallback: auto-generate
      const c = I.nome || "Nome não informado",
        l = I.cpf
          ? I.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
          : "CPF não informado",
        b = new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        m = `RAC-D${Date.now().toString().slice(-7)}`,
        x = F.get(a)?.nome || "Curso não especificado";
      try {
        await Y(L(u, "declaracoes_emitidas", m), {
          codigo: m,
          alunoNome: c,
          tipo: "Declaração de Matrícula",
          emitidoEm: H(),
        });
      } catch (E) {
        (console.error("Erro ao salvar declaração:", E),
          f("Não foi possível gerar a declaração. Tente novamente.", "error"));
        return;
      }
      ((d.innerHTML = `
                    <div class="text-center mb-6">
                        <img src="https://i.imgur.com/6rGVgIG.jpeg" alt="Logo RAC Pós-graduação" class="mx-auto mb-4" style="width: 150px;" onerror="this.style.display='none'">
                    </div>
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-bold text-purple-800">DECLARAÇÃO DE MATRÍCULA</h2>
                    </div>
                    <div class="text-lg leading-relaxed space-y-6 text-gray-700">
                        <p>Declaramos para os devidos fins que o(a) aluno(a) <strong class="font-semibold">${c}</strong>, portador(a) do CPF nº <strong class="font-semibold">${l}</strong>, está regularmente matriculado(a) no curso de pós-graduação de <strong class="font-semibold">${x}</strong>, oferecido pela RAC Pós-graduação em parceria com a Faculdade CENSUPEG no presente período letivo.</p>
                        <p>Esta declaração tem validade de 90 dias a contar da data de emissão.</p>
                    </div>
                    <div class="text-center mt-12">
                        <p class="text-lg">${b}.</p>
                    </div>
                    <div class="mt-8 text-center">
                        <p class="text-sm">Documento emitido digitalmente por:</p>
                        <p class="font-semibold">${c}</p>
                    </div>
                    <div class="mt-8 pt-4 border-t text-center text-gray-500">
                        <p class="font-semibold">Licenciada por Faculdade CENSUPEG</p>
                        <p class="text-sm">CNPJ: 10.158.686/0001-05</p>
                        <p class="text-xs mt-4">Código de Verificação: ${m}</p>
                    </div>
                `),
        e.classList.remove("hidden"),
        lucide.createIcons());
    }),
    o.addEventListener("click", async () => {
      if (!I) return;
      const c = $(
        C(u, "notas"),
        v("alunoUid", "==", I.id),
        v("cursoId", "==", a),
      ),
        l = await D(c),
        w = {};
      l.forEach((T) => {
        w[T.data().disciplina] = T.data().nota;
      });
      const b = $(C(u, "disciplinas"), v("cursoId", "==", a)),
        m = await D(b),
        x = [];
      m.forEach((T) => {
        x.push({ id: T.id, ...T.data() });
      });
      const E = {},
        p = {};
      let h = { forEach: () => { } };
      try {
        const T = $(C(u, "frequencias"), v("cursoId", "==", a));
        h = await D(T);
      } catch (T) {
        console.warn("Permissão 'frequencias' negada (Student View):", T);
      }
      h.forEach((T) => {
        const A = T.data(),
          q = A.disciplinaNome;
        (p[q] || ((p[q] = 0), (E[q] = 0)),
          p[q]++,
          A.registros && A.registros[I.id] === "F" && E[q]++);
      });
      let B = "";
      x.length === 0
        ? (B =
          '<tr><td colspan="5" class="p-2 text-center">Nenhuma disciplina cursada.</td></tr>')
        : (x.sort((T, A) => T.nome.localeCompare(A.nome)),
          (B = x
            .map((T) => {
              const A = T.nome,
                q = T.professor || "Não informado",
                G = w[A] || 0,
                Be = E[A] || 0,
                te = p[A] || 0,
                oe = te > 0 ? Math.round(((te - Be) / te) * 100) : 100;
              let K = "Cursando",
                W = "text-gray-600";
              return (
                G > 0 &&
                (G >= 7 && oe >= 75
                  ? ((K = "Aprovado"), (W = "text-green-600"))
                  : G < 7
                    ? ((K = "Reprovado (Nota)"), (W = "text-red-600"))
                    : oe < 75 &&
                    ((K = "Reprovado (Freq)"), (W = "text-orange-600"))),
                `
                            <tr class="border-b">
                                <td class="p-2">${A}</td>
                                <td class="p-2">${q}</td>
                                <td class="p-2 text-center">${G > 0 ? G.toFixed(1) : "-"}</td>
                                <td class="p-2 text-center">${oe}%</td>
                                <td class="p-2 font-semibold ${W}">${K}</td>
                            </tr>
                        `
              );
            })
            .join("")));
      const N = I.nome || "Nome não informado",
        k = I.cpf
          ? I.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
          : "CPF não informado",
        Ie = new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        ee = `RAC-H${Date.now().toString().slice(-7)}`,
        Ce = F.get(a)?.nome || "Curso não especificado";
      try {
        await Y(L(u, "declaracoes_emitidas", ee), {
          codigo: ee,
          alunoNome: N,
          tipo: "Histórico Escolar",
          emitidoEm: H(),
        });
      } catch (T) {
        (console.error("Erro ao salvar histórico:", T),
          f("Não foi possível gerar o histórico. Tente novamente.", "error"));
        return;
      }
      ((d.innerHTML = `
                    <div class="text-center mb-6">
                        <img src="https://i.imgur.com/6rGVgIG.jpeg" alt="Logo RAC Pós-graduação" class="mx-auto mb-4" style="width: 120px;" onerror="this.style.display='none'">
                    </div>
                    <div class="text-center mb-6">
                        <h2 class="text-xl font-bold text-purple-800">HISTÓRICO ESCOLAR</h2>
                    </div>
                    <div class="text-left mb-6 space-y-1 text-sm">
                        <p><strong>Aluno(a):</strong> ${N}</p>
                        <p><strong>CPF:</strong> ${k}</p>
                        <p><strong>Curso:</strong> ${Ce}</p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse min-w-[500px]">
                            <thead class="bg-purple-50">
                                <tr class="border-b-2 border-purple-200">
                                    <th class="p-2 text-purple-900 font-bold">Disciplina</th>
                                    <th class="p-2 text-purple-900 font-bold">Professor(a)</th>
                                    <th class="p-2 text-center text-purple-900 font-bold">Nota</th>
                                    <th class="p-2 text-center text-purple-900 font-bold">Freq.</th>
                                    <th class="p-2 text-center text-purple-900 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>${B}</tbody>
                        </table>
                    </div>
                    <div class="text-center mt-8">
                        <p class="text-sm">${Ie}.</p>
                    </div>
                    <div class="mt-6 text-center">
                        <p class="text-xs text-gray-500">Documento emitido digitalmente por:</p>
                        <p class="font-semibold text-sm">${N}</p>
                    </div>
                    <div class="mt-6 pt-4 border-t text-center text-gray-500 text-xs">
                        <p>Este documento pode ser validado com a secretaria acadêmica pelo e-mail: <span class="font-semibold">racposgraduacao@gmail.com</span> ou <span class="font-semibold">21 92043-1331</span>.</p>
                    </div>
                `),
        e.classList.remove("hidden"),
        lucide.createIcons());
    }),
    n.addEventListener("click", () => {
      const c = document.getElementById("documento-content").innerHTML,
        l = window.open("", "", "height=800,width=800");
      l
        ? (l.document.write(
          "<!DOCTYPE html><html><head><title>Imprimir Documento</title>",
        ),
          l.document.write(
            '<script src="https://cdn.tailwindcss.com"><\/script>',
          ),
          l.document.write(
            '<style>body { padding: 1.5rem; font-family: "Inter", sans-serif; } @media print { .print-hidden { display: none; } }</style>',
          ),
          l.document.write("</head><body>"),
          l.document.write(c),
          l.document.write("</body></html>"),
          l.document.close(),
          setTimeout(() => {
            (l.focus(), l.print(), l.close());
          }, 500))
        : f(
          "Não foi possível abrir a janela de impressão. Verifique se o seu navegador está a bloquear pop-ups.",
          "error",
        );
    }));
}
async function Ve(a) {
  const { jsPDF: e } = window.jspdf,
    t = new e();
  try {
    await le();
    const o = $(C(u, "notas"), v("disciplina", "==", a), v("cursoId", "==", y)),
      s = await D(o),
      n = [];
    (s.forEach((d) => {
      const i = d.data(),
        l = R.get(i.alunoUid)?.nome || "Aluno não encontrado",
        notaV = i.nota != null ? i.nota : null,
        w = notaV != null ? (notaV >= 6 ? "Aprovado" : "Reprovado") : "Sem nota",
        b = i.lancadoPor || "N/A",
        m = i.atualizadaEm
          ? new Date(i.atualizadaEm.seconds * 1e3).toLocaleString("pt-BR")
          : "N/A";
      n.push([l, notaV != null ? notaV.toFixed(1) : '-', w, b, m]);
    }),
      n.sort((d, i) => d[0].localeCompare(i[0])));
    const r = new Date().toLocaleDateString("pt-BR");
    (t.setFontSize(18),
      t.text("Relatório de Notas", 14, 22),
      t.setFontSize(12),
      t.text(`Disciplina: ${a}`, 14, 30),
      t.text(`Curso: ${F.get(y)?.nome || "N/A"}`, 14, 36),
      t.text(`Gerado em: ${r}`, 14, 42),
      t.autoTable({
        startY: 50,
        head: [
          [
            "Aluno",
            "Nota Final",
            "Status",
            "Lançado Por",
            "Data do Lançamento",
          ],
        ],
        body: n,
        theme: "grid",
        headStyles: { fillColor: [88, 28, 135] },
      }),
      t.save(`Relatorio_${a.replace(/\s+/g, "_")}_${r}.pdf`));
  } catch (o) {
    (console.error("Erro ao gerar PDF:", o),
      f("Falha ao gerar o relatório.", "error"));
  }
}
async function Je(a, e) {
  const { jsPDF: t } = window.jspdf,
    o = new t();
  try {
    const s = await _(L(u, "utilizadores", a));
    if (!s.exists()) {
      f("Aluno não encontrado.", "error");
      return;
    }
    const n = s.data(),
      r = $(C(u, "notas"), v("alunoUid", "==", a), v("cursoId", "==", e)),
      d = await D(r),
      i = [];
    // Fetch turmas to get period info
    let turmasAluno = [];
    try {
      const turmasSnap = await D($(C(u, 'turmas'), v('cursoId', '==', e)));
      turmasSnap.forEach(td => turmasAluno.push({ id: td.id, ...td.data() }));
    } catch (te) { console.warn('Turmas not available for PDF', te); }

    d.forEach((E) => {
      const p = E.data(),
        h =
          (Array.from(U.values()).find((N) => N.nome === p.disciplina) || {})
            ?.professor || "Não informado",
        notaF = p.nota != null ? p.nota : null,
        B = notaF != null ? (notaF >= 6 ? "Aprovado" : "Reprovado") : "Sem nota";
      // Find turma period for this discipline
      const turmaDisc = turmasAluno.find(t => t.disciplinaNome === p.disciplina && (t.alunos || []).includes(a));
      const periodo = turmaDisc ? turmaDisc.periodo : '';
      i.push([p.disciplina, h, periodo, notaF != null ? notaF.toFixed(1) : '-', B]);
    });
    const c = "https://i.imgur.com/6rGVgIG.jpeg",
      l = new Image();
    ((l.src = c),
      await new Promise((E) => {
        (l.complete && E(), (l.onload = E), (l.onerror = E));
      }));
    try {
      o.addImage(l, "JPEG", 15, 10, 40, 0);
    } catch (E) {
      console.warn("Logo load failed", E);
    }
    (o.setFontSize(18),
      o.text("Ficha Individual do Aluno", 60, 20),
      o.setFontSize(12),
      o.text("Dados Pessoais", 14, 55),
      o.setFontSize(10));
    let b = 60;
    ([
      [`Nome Completo: ${n.nome || "Não informado"}`],
      [`CPF: ${n.cpf || "Não informado"}`],
      [`Endereço: ${n.endereco || "Não informado"}`],
      [`Pai: ${n.pai || "Não informado"}`],
      [`Mãe: ${n.mae || "Não informado"}`],
    ].forEach((E) => {
      (o.text(E[0], 14, b), (b += 6));
    }),
      (b += 5),
      o.setFontSize(12),
      o.text("Dados do Curso", 14, b),
      (b += 5),
      o.setFontSize(10),
      [
        [`Curso: ${F.get(e)?.nome || "Não informado"}`],
        [`Data de Início: ${n.dataInicio || "Não informado"}`],
        [`Previsão de Término: ${n.previsaoTermino || "Não informado"}`],
        [`Título do TCC: ${n.tituloTCC || "Não informado"}`],
        [`Orientador: ${n.orientadorTCC || "Não informado"}`],
        [`Data da Defesa: ${n.dataDefesa || "Não informado"}`],
      ].forEach((E) => {
        (o.text(E[0], 14, b), (b += 6));
      }),
      (b += 10),
      o.autoTable({
        startY: b,
        head: [["Disciplina", "Professor", "Período", "Nota", "Status"]],
        body: i,
        theme: "grid",
        headStyles: { fillColor: [88, 28, 135] },
      }),
      o.save(`Ficha_Individual_${n.nome.replace(/\s+/g, "_")}.pdf`),
      f("Ficha gerada com sucesso!", "success"));
  } catch (s) {
    (console.error("Erro ao gerar Ficha Individual:", s),
      f("Erro ao gerar a ficha.", "error"));
  }
}
let ne = null;
function ve() {
  return (ne || (ne = pe(fe, "SecondaryApp")), ne);
}
document
  .getElementById("nova-disciplina-form")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = a.target.querySelector("button"),
      t = e.textContent;
    ((e.disabled = !0), (e.textContent = "Salvando..."));
    try {
      const o = document.getElementById("new-disciplina-nome").value,
        s = document.getElementById("new-disciplina-prof").value;
      if (!y) throw new Error("Curso não selecionado");
      (await de(C(u, "disciplinas"), { nome: o, professor: s, cursoId: y }),
        f("Disciplina cadastrada com sucesso!", "success"),
        a.target.reset(),
        document.getElementById("disciplina-modal").classList.add("hidden"),
        await Z(y),
        ye(y),
        J("coord", y));
    } catch (o) {
      (console.error("Erro ao cadastrar disciplina:", o),
        f("Erro ao cadastrar disciplina.", "error"));
    } finally {
      ((e.disabled = !1), (e.textContent = t));
    }
  });
document
  .getElementById("cadastro-professor-form")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = a.target.querySelector("button"),
      t = e.textContent;
    ((e.disabled = !0), (e.textContent = "Processando..."));
    try {
      const o = document.getElementById("prof-nome").value,
        s = document.getElementById("prof-cpf").value,
        n = s.replace(/\D/g, "");
      if (n.length !== 11)
        throw new Error("CPF inválido (deve ter 11 dígitos)");
      const r = re(ve()),
        d = `cpf.${n}@rac.portal`,
        i = n.substring(0, 6),
        l = (await ge(r, d, i)).user.uid;
      (await Y(L(u, "utilizadores", l), {
        nome: o,
        cpf: s,
        role: "professor",
        cursos: [y],
        criadoEm: H(),
      }),
        await z(r),
        f(`Professor ${o} cadastrado!`, "success"),
        a.target.reset(),
        document
          .getElementById("cadastro-professor-modal")
          .classList.add("hidden"));
    } catch (o) {
      (console.error("Erro prof:", o), f(o.message, "error"));
    } finally {
      ((e.disabled = !1), (e.textContent = t));
    }
  });
document
  .getElementById("cadastro-aluno-form")
  ?.addEventListener("submit", async (a) => {
    a.preventDefault();
    const e = a.target.querySelector("button"),
      t = e.textContent;
    ((e.disabled = !0), (e.textContent = "Cadastrando..."));
    try {
      const o = document.getElementById("cad-nome").value,
        s = document.getElementById("cad-cpf").value,
        n = document.getElementById("cad-pai").value,
        r = document.getElementById("cad-mae").value,
        d = document.getElementById("cad-endereco").value,
        i = document.getElementById("cad-dataInicio").value,
        c = document.getElementById("cad-previsaoTermino").value,
        ec = document.getElementById("cad-emailContato")?.value || '',
        l = s.replace(/\D/g, "");
      if (l.length !== 11) throw new Error("CPF inválido");
      const w = re(ve()),
        b = `cpf.${l}@rac.portal`,
        m = l.substring(0, 6),
        E = (await ge(w, b, m)).user.uid;
      (await Y(L(u, "utilizadores", E), {
        nome: o,
        cpf: s,
        pai: n,
        mae: r,
        endereco: d,
        dataInicio: i,
        previsaoTermino: c,
        emailContato: ec,
        role: "aluno",
        cursos: [y],
        criadoEm: H(),
      }),
        await z(w),
        f("Aluno cadastrado com sucesso!", "success"),
        a.target.reset(),
        document.getElementById("cadastro-aluno-modal").classList.add("hidden"),
        R.clear(),
        await le(),
        V("coord", y),
        V("ficha", y));
    } catch (o) {
      (console.error("Erro ao cadastrar aluno:", o),
        o.code === "auth/email-already-in-use"
          ? f("Este CPF já possui cadastro.", "error")
          : f("Erro ao cadastrar aluno: " + o.message, "error"));
    } finally {
      ((e.disabled = !1), (e.textContent = t));
    }
  });
lucide.createIcons();
const Ye = "15632157725";
function Qe() {
  return I ? (I.cpf || "").toString().replace(/\D/g, "") === Ye : !1;
}
function Ke() {
  const a = document.getElementById("coordenador-ferramentas-container"),
    e = document.getElementById("btn-admin-tools");
  if ((e && e.remove(), !!a)) {
    if (Qe()) {
      const t = document.createElement("button");
      ((t.id = "btn-admin-tools"),
        (t.className =
          "w-full mb-4 p-3 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"),
        (t.innerHTML =
          '<i data-lucide="settings" class="w-4 h-4"></i> ADMIN: Gerenciar Ferramentas'),
        (t.onclick = we),
        a.parentElement && a.parentElement.insertBefore(t, a));
    }
    if (!document.getElementById("btn-coord-chamada")) {
      const t = document.createElement("button");
      ((t.id = "btn-coord-chamada"),
        (t.className =
          "w-full mb-4 p-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 flex items-center justify-center gap-2 shadow-lg transition"),
        (t.innerHTML =
          '<i data-lucide="calendar-check" class="w-4 h-4"></i> ABRIR DIÁRIO DE CLASSE'),
        (t.onclick = () => {
          document
            .getElementById("coordenador-dashboard")
            .classList.add("hidden");
          const o = document.getElementById("panel-chamada");
          o.classList.remove("hidden");
          const s = document.getElementById("chamada-voltar-container");
          s.innerHTML = "";
          const n = document.createElement("button");
          ((n.className =
            "text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold transition"),
            (n.innerHTML =
              '<i data-lucide="arrow-left" class="w-4 h-4"></i> Voltar'),
            (n.onclick = () => {
              (o.classList.add("hidden"),
                document
                  .getElementById("coordenador-dashboard")
                  .classList.remove("hidden"));
            }),
            s.appendChild(n),
            lucide.createIcons(),
            J("chamada"));
        }),
        a.parentElement && a.parentElement.insertBefore(t, a));
    }
    if (!document.getElementById("btn-coord-relatorio")) {
      const t = document.createElement("button");
      ((t.id = "btn-coord-relatorio"),
        (t.className =
          "w-full mb-4 p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg transition"),
        (t.innerHTML =
          '<i data-lucide="bar-chart-2" class="w-4 h-4"></i> RELATÓRIOS DE FREQUÊNCIA'),
        (t.onclick = () => {
          (document
            .getElementById("coordenador-dashboard")
            .classList.add("hidden"),
            document
              .getElementById("panel-relatorio-coord")
              .classList.remove("hidden"),
            Ee(y));
        }),
        a.parentElement && a.parentElement.insertBefore(t, a));
    }
    lucide.createIcons();
  }
}
async function Ee(a, e = null) {
  const t = document.getElementById("relatorio-conteudo");
  t.innerHTML =
    '<div class="text-center p-8"><p class="animate-pulse text-indigo-500 font-bold">Gerando relatório...</p></div>';
  try {
    const o = {};
    let s = [];
    const n = $(C(u, "utilizadores"), v("role", "==", "professor")),
      r = await D(n);
    let d = "";
    if (
      (r.forEach((p) => {
        const g = p.data();
        (e &&
          p.id === e &&
          ((d = g.nome), g.disciplinas && s.push(...g.disciplinas)),
          g.cursos &&
          g.cursos.includes(a) &&
          g.disciplinas &&
          g.disciplinas.forEach((h) => (o[h] = g.nome)));
      }),
        e && d)
    ) {
      const p = $(C(u, "disciplinas"), v("cursoId", "==", a));
      (await D(p)).forEach((h) => {
        const B = h.data();
        B.professor &&
          B.professor.trim().toLowerCase() === d.trim().toLowerCase() &&
          (s.includes(B.nome) || s.push(B.nome));
      });
    }
    const i = {},
      c = $(C(u, "utilizadores"), v("role", "==", "aluno"));
    (await D(c)).forEach((p) => {
      i[p.id] = p.data().nome || "Aluno Sem Nome";
    });
    const w = $(C(u, "notas"), v("cursoId", "==", a)),
      b = await D(w),
      m = {},
      x = {};
    if (
      (b.forEach((p) => {
        const g = p.data(),
          h = g.disciplina,
          B = i[g.alunoUid] || "Aluno Não Encontrado";
        (m[h] ||
          (m[h] = {
            dates: new Set(),
            totalP: 0,
            totalF: 0,
            alunos: new Set(),
            studentStats: {},
          }),
          m[h].alunos.add(g.alunoUid),
          g.chamadas &&
          Object.entries(g.chamadas).forEach(([N, k]) => {
            if (
              (m[h].dates.add(N),
                k === "P" ? m[h].totalP++ : m[h].totalF++,
                m[h].studentStats[g.alunoUid] ||
                (m[h].studentStats[g.alunoUid] = { p: 0, f: 0, name: B }),
                k === "P"
                  ? m[h].studentStats[g.alunoUid].p++
                  : m[h].studentStats[g.alunoUid].f++,
                e)
            ) {
              const S = `${h}_${N}`;
              (x[S] ||
                (x[S] = {
                  key: S,
                  date: N,
                  disc: h,
                  p: 0,
                  f: 0,
                  presentes: [],
                  faltas: [],
                }),
                k === "P"
                  ? (x[S].p++, x[S].presentes.push(B))
                  : (x[S].f++, x[S].faltas.push(B)));
            }
          }));
      }),
        e)
    ) {
      const p = Object.values(x).sort(
        (h, B) => new Date(B.date) - new Date(h.date),
      );
      if (((window.currentRelatorioEvents = p), p.length === 0)) {
        t.innerHTML = `
                        <div class="text-center p-8">
                            <p class="text-gray-400 mb-2 font-medium">Nenhum registro de chamada encontrado.</p>
                            <div class="mt-4 p-4 bg-gray-50 rounded-lg inline-block border border-gray-100">
                                <p class="text-xs text-gray-500 font-bold mb-1">Disciplinas vinculadas:</p>
                                <p class="text-xs text-gray-400 italic">${s.length > 0 ? s.join(", ") : "Nenhuma"}</p>
                            </div>
                        </div>`;
        return;
      }
      let g = `
                    <div class="mb-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-indigo-900">Meus Registros de Chamada</h4>
                            <p class="text-xs text-indigo-700">Histórico detalhado de lançamentos.</p>
                        </div>
                    </div>
                    <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <table class="w-full text-sm item-table">
                            <thead class="bg-gray-50 text-gray-700">
                                <tr>
                                    <th class="p-4 text-left">Data da Aula</th>
                                    <th class="p-4 text-left">Disciplina</th>
                                    <th class="p-4 text-center text-teal-600">Presentes</th>
                                    <th class="p-4 text-center text-red-500">Faltas</th>
                                    <th class="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                    `;
      (p.forEach((h, B) => {
        const N = h.date.split("-").reverse().join("/");
        g += `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="p-4 font-bold text-gray-800">${N}</td>
                            <td class="p-4 text-gray-600">${h.disc}</td>
                            <td class="p-4 text-center font-bold text-teal-600 bg-teal-50/50 rounded-lg">${h.p}</td>
                            <td class="p-4 text-center font-bold text-red-500 bg-red-50/50 rounded-lg">${h.f}</td>
                            <td class="p-4 text-right">
                                <button onclick="window.verDetalhesChamadaIndex(${B})" class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs hover:bg-indigo-200 transition flex items-center gap-1 ml-auto">
                                    <i data-lucide="eye" class="w-3 h-3"></i> Detalhes
                                </button>
                            </td>
                        </tr>`;
      }),
        (g += "</tbody></table></div>"),
        (t.innerHTML = g));
      return;
    }
    if (Object.keys(m).length === 0) {
      t.innerHTML =
        '<p class="text-center text-gray-400 p-8">Nenhum registro de frequência encontrado.</p>';
      return;
    }
    let E = `
                <div class="mb-4 flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div>
                        <h4 class="font-bold text-indigo-900">Resumo Geral</h4>
                        <p class="text-xs text-indigo-700">${Object.keys(m).length} Disciplinas com registros</p>
                    </div>
                     <select id="filtro-relatorio-disc" onchange="filtrarRelatorio()" class="p-2 border border-indigo-200 rounded-lg text-sm bg-white cursor-pointer hover:border-indigo-400 transition">
                        <option value="todos">Todas as Disciplinas</option>
                        ${Object.keys(m)
        .sort()
        .map((p) => `<option value="${p}">${p}</option>`)
        .join("")}
                     </select>
                </div>
                <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <table class="w-full text-sm item-table">
                        <thead class="bg-gray-50 text-gray-700">
                            <tr>
                                <th class="p-4 text-left">Disciplina</th>
                                <th class="p-4 text-left">Professor Responsável</th>
                                <th class="p-4 text-center">Aulas Dadas</th>
                                <th class="p-4 text-center">Presença Média</th>
                                <th class="p-4 text-center">Última Aula</th>
                                <th class="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
               `;
    ((window.coordRelatorioStats = m),
      Object.keys(m)
        .sort()
        .forEach((p) => {
          const g = m[p],
            h =
              o[p] ||
              '<span class="text-gray-400 italic">Não identificado</span>',
            B = g.totalP + g.totalF,
            N = B > 0 ? ((g.totalP / B) * 100).toFixed(1) : 0,
            k = Array.from(g.dates).sort(),
            S =
              k.length > 0
                ? k[k.length - 1].split("-").reverse().join("/")
                : "-";
          E += `
                    <tr class="hover:bg-indigo-50/30 transition relatorio-row" data-disc="${p}">
                        <td class="p-4 font-bold text-gray-800">${p}</td>
                        <td class="p-4 text-gray-600">${h}</td>
                        <td class="p-4 text-center">
                            <span class="px-2 py-1 bg-teal-100 text-teal-800 rounded-md font-bold text-xs">${g.dates.size}</span>
                        </td>
                         <td class="p-4 text-center font-bold ${N < 75 ? "text-red-500" : "text-green-600"}">
                            ${N}%
                        </td>
                        <td class="p-4 text-center text-gray-500 text-xs">${S}</td>
                        <td class="p-4 text-right">
                            <button onclick="window.abrirDetalhesDisciplina('${p.replace(/'/g, "\\'")}')" class="px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2 ml-auto">
                                <i data-lucide="users" class="w-3 h-3"></i> Alunos
                            </button>
                        </td>
                    </tr>
                   `;
        }),
      (E += "</tbody></table></div>"),
      (t.innerHTML = E),
      (window.filtrarRelatorio = () => {
        const p = document.getElementById("filtro-relatorio-disc").value;
        document.querySelectorAll(".relatorio-row").forEach((g) => {
          p === "todos" || g.dataset.disc === p
            ? g.classList.remove("hidden")
            : g.classList.add("hidden");
        });
      }));
  } catch (o) {
    (console.error("Erro relatório:", o),
      (t.innerHTML = `<p class="text-red-500 text-center p-8">Erro ao gerar relatório: ${o.message}</p>`));
  }
}
window.verDetalhesChamadaIndex = (a) => {
  const e = window.currentRelatorioEvents[a];
  if (!e) return;
  const t = e.date.split("-").reverse().join("/"),
    o = document.createElement("div");
  o.className =
    "fixed inset-0 bg-black/50 z-[70] flex items-center justify-center backdrop-blur-sm p-4 fade-in";
  const s =
    e.presentes.length > 0
      ? e.presentes
        .map(
          (d) =>
            `<div class="p-2 border-b border-gray-100 text-sm text-gray-600 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-teal-500"></div>${d}</div>`,
        )
        .join("")
      : '<p class="text-sm text-gray-400 p-2 italic">Nenhum presente</p>',
    n =
      e.faltas.length > 0
        ? e.faltas
          .map(
            (d) =>
              `<div class="p-2 border-b border-gray-100 text-sm text-gray-600 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-red-500"></div>${d}</div>`,
          )
          .join("")
        : '<p class="text-sm text-gray-400 p-2 italic">Nenhuma falta</p>';
  ((o.innerHTML = `
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 animate-[popIn_0.2s_ease-out_forwards]">
                    <div class="p-6 bg-indigo-600 text-white flex justify-between items-center">
                        <div>
                           <p class="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">${e.disc}</p>
                           <h3 class="text-xl font-bold flex items-center gap-2"><i data-lucide="calendar" class="w-5 h-5"></i> ${t}</h3>
                        </div>
                        <button id="close-modal-detalhe-prof" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    
                    <div class="p-6 max-h-[70vh] overflow-y-auto">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                <h4 class="font-bold text-teal-800 mb-3 flex items-center gap-2 text-sm"><i data-lucide="check-circle" class="w-4 h-4"></i> Presentes (${e.p})</h4>
                                <div class="bg-white rounded-lg shadow-sm border border-teal-100 divide-y divide-gray-50">
                                    ${s}
                                </div>
                            </div>
                            
                            <div class="bg-red-50 rounded-xl p-4 border border-red-100">
                                <h4 class="font-bold text-red-800 mb-3 flex items-center gap-2 text-sm"><i data-lucide="x-circle" class="w-4 h-4"></i> Faltas (${e.f})</h4>
                                <div class="bg-white rounded-lg shadow-sm border border-red-100 divide-y divide-gray-50">
                                    ${n}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `),
    document.body.appendChild(o),
    lucide.createIcons());
  const r = () => {
    (o.classList.add("opacity-0"), setTimeout(() => o.remove(), 200));
  };
  ((o.querySelector("#close-modal-detalhe-prof").onclick = r),
    (o.onclick = (d) => {
      d.target === o && r();
    }));
};
window.abrirDetalhesDisciplina = (a) => {
  const e = window.coordRelatorioStats[a];
  if (!e) return;
  const t = Object.values(e.studentStats).sort((d, i) =>
    d.name.localeCompare(i.name),
  ),
    o = document.createElement("div");
  o.className =
    "fixed inset-0 bg-black/50 z-[90] flex items-center justify-center backdrop-blur-sm p-4 fade-in";
  let s = t
    .map((d) => {
      const i = d.p + d.f,
        c = i > 0 ? ((d.p / i) * 100).toFixed(0) : 0,
        l = c < 75 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50";
      return `
                    <tr class="hover:bg-gray-50 border-b border-gray-50 student-row" data-name="${d.name.toLowerCase()}">
                        <td class="p-3 text-gray-800 font-medium">${d.name}</td>
                        <td class="p-3 text-center">
                            <span class="px-2 py-1 rounded-md text-xs font-bold ${l}">${c}%</span>
                        </td>
                        <td class="p-3 text-center text-teal-600 font-bold">${d.p}</td>
                        <td class="p-3 text-center text-red-500 font-bold">${d.f}</td>
                    </tr>
                 `;
    })
    .join("");
  ((o.innerHTML = `
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300">
                    <div class="p-5 bg-indigo-900 text-white flex justify-between items-center shrink-0">
                        <div>
                             <p class="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Detalhamento por Aluno</p>
                             <h3 class="font-bold text-lg flex items-center gap-2"><i data-lucide="book-open" class="w-5 h-5"></i> ${a}</h3>
                        </div>
                        <button id="close-modal-disc" class="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"><i data-lucide="x" class="w-5 h-5"></i></button>
                    </div>
                    
                    <div class="p-4 bg-gray-50 border-b border-gray-200 shrink-0">
                        <div class="relative">
                            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-gray-400"></i>
                            <input type="text" id="search-student-disc" placeholder="Buscar aluno..." class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition">
                        </div>
                    </div>

                    <div class="overflow-y-auto p-0 flex-1">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-100 text-gray-600 sticky top-0">
                                <tr>
                                    <th class="p-3 text-left font-semibold">Aluno</th>
                                    <th class="p-3 text-center font-semibold">% Freq.</th>
                                    <th class="p-3 text-center font-semibold">Presenças</th>
                                    <th class="p-3 text-center font-semibold">Faltas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${s}
                            </tbody>
                        </table>
                        ${t.length === 0 ? '<p class="text-center p-8 text-gray-400">Nenhum aluno com registro.</p>' : ""}
                    </div>
                    
                    <div class="p-3 bg-gray-50 text-right text-xs text-gray-400 border-t border-gray-200 shrink-0">
                        Total: ${t.length} alunos listados
                    </div>
                </div>
             `),
    document.body.appendChild(o),
    lucide.createIcons());
  const n = o.querySelector("#search-student-disc");
  n.onkeyup = (d) => {
    const i = d.target.value.toLowerCase();
    o.querySelectorAll(".student-row").forEach((c) => {
      const l = c.dataset.name;
      c.style.display = l.includes(i) ? "" : "none";
    });
  };
  const r = () => o.remove();
  ((o.querySelector("#close-modal-disc").onclick = r),
    (o.onclick = (d) => {
      d.target === o && r();
    }));
};
window.verDetalhesFrequencia = (a, e) => {
  const t = document.createElement("div");
  ((t.className =
    "fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm p-4"),
    (t.onclick = (n) => {
      n.target === t && t.remove();
    }));
  let o = "";
  const s = Object.keys(e || {})
    .sort()
    .reverse();
  (s.length === 0
    ? (o =
      '<p class="text-gray-400 text-center py-4">Nenhum registro de frequência.</p>')
    : s.forEach((n) => {
      const r = e[n],
        d =
          r === "P" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50",
        i = r === "P" ? "Presente" : "Falta";
      o += `
                        <div class="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                            <span class="font-medium text-gray-700">${n.split("-").reverse().join("/")}</span>
                            <span class="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${d}">
                                ${i}
                            </span>
                        </div>
                     `;
    }),
    (t.innerHTML = `
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="p-4 bg-purple-600 text-white flex justify-between items-center">
                        <h3 class="font-bold flex items-center gap-2"><i data-lucide="calendar"></i> Histórico: ${a}</h3>
                        <button class="hover:bg-white/20 p-1 rounded-full text-white" onclick="this.closest('.fixed').remove()"><i data-lucide="x" class="w-5 h-5"></i></button>
                    </div>
                    <div class="p-2 max-h-[60vh] overflow-y-auto">
                        ${o}
                    </div>
                    <div class="p-3 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
                        Clique fora para fechar
                    </div>
                </div>
             `),
    document.body.appendChild(t),
    lucide.createIcons());
};
let M = [];
async function we() {
  const a = document.getElementById("admin-tools-modal"),
    e = document.getElementById("admin-tools-list");
  (a.classList.remove("hidden"),
    (e.innerHTML = '<p class="text-center text-gray-500">Carregando...</p>'));
  try {
    ((M = ((await _(L(u, "cursos", y))).data().ferramentas || []).map((s) =>
      s.perfil ? s : { ...s, perfil: ["aluno", "professor", "coordenador"] },
    )),
      ue());
  } catch (t) {
    (console.error(t), f("Erro ao carregar ferramentas.", "error"));
  }
}
function ue() {
  const a = document.getElementById("admin-tools-list");
  ((a.innerHTML = ""),
    M.forEach((e, t) => {
      const o = document.createElement("div");
      o.className =
        "bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center";
      const s = e.perfil || [],
        n = s.includes("aluno"),
        r = s.includes("professor"),
        d = s.includes("coordenador");
      ((o.innerHTML = `
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500">Título</label>
                            <input type="text" value="${e.titulo || ""}" onchange="updateTool(${t}, 'titulo', this.value)" class="w-full p-2 border rounded-lg text-sm bg-gray-50">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500">URL</label>
                            <input type="text" value="${e.url || ""}" onchange="updateTool(${t}, 'url', this.value)" class="w-full p-2 border rounded-lg text-sm bg-gray-50">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500">Ícone</label>
                            <input type="text" value="${e.icone || e.icon || ""}" onchange="updateTool(${t}, 'icone', this.value)" class="w-full p-2 border rounded-lg text-sm bg-gray-50">
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-[150px]">
                        <label class="text-xs font-bold text-gray-500">Visível para:</label>
                        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input type="checkbox" ${n ? "checked" : ""} onchange="toggleToolProfile(${t}, 'aluno')" class="rounded text-purple-600 focus:ring-purple-500"> Aluno
                        </label>
                        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input type="checkbox" ${r ? "checked" : ""} onchange="toggleToolProfile(${t}, 'professor')" class="rounded text-purple-600 focus:ring-purple-500"> Professor
                        </label>
                        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input type="checkbox" ${d ? "checked" : ""} onchange="toggleToolProfile(${t}, 'coordenador')" class="rounded text-purple-600 focus:ring-purple-500"> Coord.
                        </label>
                    </div>

                    <button onclick="removeTool(${t})" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Remover">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                `),
        a.appendChild(o));
    }),
    lucide.createIcons());
}
function We(a, e, t) {
  M[a][e] = t;
}
function Xe(a, e) {
  M[a].perfil || (M[a].perfil = []);
  const t = M[a].perfil;
  t.includes(e)
    ? (M[a].perfil = t.filter((o) => o !== e))
    : M[a].perfil.push(e);
}
function Ze() {
  (M.push({
    titulo: "Nova",
    url: "https://",
    icone: "link",
    perfil: ["aluno", "professor", "coordenador"],
  }),
    ue());
}
function et(a) {
  confirm("Tem certeza?") && (M.splice(a, 1), ue());
}
async function tt() {
  try {
    (await O(L(u, "cursos", y), { ferramentas: M }),
      f("Ferramentas atualizadas!", "success"),
      document.getElementById("admin-tools-modal").classList.add("hidden"));
    const a = await _(L(u, "cursos", y));
    (F.set(y, a.data()), ie(I.role, y));
  } catch (a) {
    (console.error(a), f("Erro ao salvar.", "error"));
  }
}
window.openAdminToolsModal = we;
window.saveAdminTools = tt;
window.addAdminToolRow = Ze;
window.removeTool = et;
window.updateTool = We;
window.toggleToolProfile = Xe;

// ============ GESTÃO DE TURMAS (Fase 2) ============
let turmasCache = [];
let turmaFiltroAtual = 'ativa';

// Carregar turmas do Firestore
async function carregarTurmasGestao() {
  const container = document.getElementById('turmas-gestao-container');
  if (!container) return;
  container.innerHTML = '<p class="text-center text-gray-400 py-4">Carregando turmas...</p>';

  try {
    const q = y ? $(C(u, 'turmas'), v('cursoId', '==', y)) : C(u, 'turmas');
    const snap = await D(q);
    turmasCache = [];
    snap.forEach(d => {
      turmasCache.push({ id: d.id, ...d.data() });
    });
    turmasCache.sort((a, b) => {
      // Ativas primeiro, depois por período desc
      if (a.status !== b.status) return a.status === 'ativa' ? -1 : 1;
      return (b.periodo || '').localeCompare(a.periodo || '');
    });
    renderTurmasGestao();
  } catch (err) {
    console.error('Erro ao carregar turmas:', err);
    container.innerHTML = '<p class="text-center text-red-400 py-4">Erro ao carregar turmas.</p>';
  }
}

function renderTurmasGestao() {
  const container = document.getElementById('turmas-gestao-container');
  if (!container) return;

  let filtered = turmasCache;
  if (turmaFiltroAtual !== 'todas') {
    filtered = turmasCache.filter(t => t.status === turmaFiltroAtual);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-400 py-4">${turmaFiltroAtual === 'ativa' ? 'Nenhuma turma ativa. Crie uma nova!' : 'Nenhuma turma encontrada.'}</p>`;
    return;
  }

  container.innerHTML = '';
  filtered.forEach(t => {
    const isAtiva = t.status === 'ativa';
    const statusBadge = isAtiva
      ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Ativa</span>'
      : '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Concluída</span>';
    const numAlunos = (t.alunos || []).length;

    const div = document.createElement('div');
    div.className = `p-3 rounded-xl border transition cursor-pointer ${isAtiva ? 'bg-white border-purple-200 shadow-sm hover:border-purple-400 hover:shadow-md' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`;
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-700">${t.disciplinaNome || 'Sem nome'}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">${t.nome || ''} • ${t.periodo || ''} • ${numAlunos} aluno(s)</p>
          ${t.professorNome && t.professorNome !== 'Não definido' ? `<p class="text-[10px] text-gray-400">Prof: ${t.professorNome}</p>` : ''}
        </div>
        <div class="flex items-center gap-2">
          ${statusBadge}
          ${isAtiva ? `<button onclick="event.stopPropagation(); concluirTurma('${t.id}')" title="Concluir turma" class="p-1 text-gray-400 hover:text-red-500 transition"><i data-lucide="check-circle" class="w-4 h-4"></i></button>` : ''}
          <button onclick="event.stopPropagation(); excluirTurma('${t.id}')" title="Excluir turma" class="p-1 text-gray-400 hover:text-red-600 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div>
      </div>
    `;
    div.onclick = () => abrirGerenciarTurma(t.id);
    container.appendChild(div);
  });
  lucide.createIcons();
}

window.filtrarTurmas = function (filtro) {
  turmaFiltroAtual = filtro;
  // Update button styles
  const btns = {
    'ativa': document.getElementById('filtro-turma-ativa'),
    'concluída': document.getElementById('filtro-turma-concluida'),
    'todas': document.getElementById('filtro-turma-todas'),
  };
  Object.entries(btns).forEach(([key, btn]) => {
    if (!btn) return;
    if (key === filtro) {
      btn.className = 'px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200';
    } else {
      btn.className = 'px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500 border border-gray-200';
    }
  });
  renderTurmasGestao();
};

window.concluirTurma = async function (turmaId) {
  if (!confirm('Deseja marcar esta turma como concluída?')) return;
  try {
    await O(L(u, 'turmas', turmaId), { status: 'concluída' });
    f('Turma marcada como concluída!', 'success');
    await carregarTurmasGestao();
  } catch (err) {
    console.error('Erro ao concluir turma:', err);
    f('Erro ao concluir turma.', 'error');
  }
};

window.excluirTurma = async function (turmaId) {
    if (!confirm('Deseja EXCLUIR esta turma permanentemente?')) return;
    try {
        await Ne(L(u, 'turmas', turmaId));
        f('Turma excluída com sucesso!', 'success');
        await carregarTurmasGestao();
    } catch (err) {
        console.error('Erro ao excluir turma:', err);
        f('Erro ao excluir turma.', 'error');
    }
};

// Populate "Nova Turma" modal when discipline changes
async function populateNovaTurmaAlunos() {
  const discSelect = document.getElementById('turma-disciplina-select');
  const alunosList = document.getElementById('turma-alunos-list');
  const discId = discSelect.value;

  if (!discId) {
    alunosList.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Selecione uma disciplina.</p>';
    return;
  }

  alunosList.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Carregando alunos...</p>';

  try {
    // Get discipline name
    const discData = U.get(discId);
    const discNome = discData?.nome || discId;

    // Auto-fill professor from discipline data
    if (discData?.professor) {
      document.getElementById('turma-professor').value = discData.professor;
    }

    // Get all alunos in the course
    const alunosSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const todosAlunos = [];
    alunosSnap.forEach(d => { todosAlunos.push({ id: d.id, ...d.data() }); });
    todosAlunos.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    // Get turmas already concluded for this discipline to find students who already took it
    const turmasDiscSnap = await D($(C(u, 'turmas'), v('disciplinaId', '==', discId), v('status', '==', 'concluída')));
    const alunosJaFizeram = new Set();
    turmasDiscSnap.forEach(d => {
      const alunos = d.data().alunos || [];
      alunos.forEach(uid => alunosJaFizeram.add(uid));
    });

    // Also check notas for legacy data
    const notasSnap = await D($(C(u, 'notas'), v('disciplina', '==', discNome), v('cursoId', '==', y)));
    notasSnap.forEach(d => {
      const data = d.data();
      if (data.nota != null) {
        alunosJaFizeram.add(data.alunoUid);
      }
    });

    // Filter out students who already took this discipline
    const alunosDisponiveis = todosAlunos.filter(a => !alunosJaFizeram.has(a.id));

    if (alunosDisponiveis.length === 0) {
      alunosList.innerHTML = '<p class="text-xs text-amber-600 text-center py-2 font-medium">Todos os alunos já fizeram esta disciplina.</p>';
      updateTurmaAlunosCount();
      return;
    }

    alunosList.innerHTML = '';
    alunosDisponiveis.forEach(aluno => {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition';
      label.innerHTML = `
        <input type="checkbox" name="turma-aluno" value="${aluno.id}" checked class="rounded text-purple-600 turma-aluno-cb" onchange="updateTurmaAlunosCount()">
        <span class="text-sm text-gray-700">${aluno.nome || aluno.cpf}</span>
      `;
      alunosList.appendChild(label);
    });
    updateTurmaAlunosCount();
  } catch (err) {
    console.error('Erro ao carregar alunos:', err);
    alunosList.innerHTML = '<p class="text-xs text-red-400 text-center py-2">Erro ao carregar.</p>';
  }
}

window.updateTurmaAlunosCount = function () {
  const cbs = document.querySelectorAll('.turma-aluno-cb:checked');
  const el = document.getElementById('turma-alunos-count');
  if (el) el.textContent = `${cbs.length} selecionados`;
};

window.toggleAllTurmaAlunos = function (checked) {
  document.querySelectorAll('.turma-aluno-cb').forEach(cb => { cb.checked = checked; });
  updateTurmaAlunosCount();
};

// Setup "Nova Turma" modal
function setupNovaTurmaModal() {
  const discSelect = document.getElementById('turma-disciplina-select');
  if (!discSelect) return;

  // Populate disciplines
  discSelect.innerHTML = '<option value="">Selecione a disciplina...</option>';
  const discs = Array.from(U.values());
  discs.sort((a, b) => a.nome.localeCompare(b.nome));
  discs.forEach(d => {
    discSelect.innerHTML += `<option value="${d.id}">${d.nome}</option>`;
  });

  // When discipline changes, load available students
  discSelect.onchange = populateNovaTurmaAlunos;

  // Form submission
  const form = document.getElementById('nova-turma-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Criando...';

      try {
        const discId = document.getElementById('turma-disciplina-select').value;
        const discData = U.get(discId);
        if (!discId || !discData) throw new Error('Selecione uma disciplina.');

        const nome = document.getElementById('turma-nome').value;
        const periodo = document.getElementById('turma-periodo').value;
        const professor = document.getElementById('turma-professor').value;
        const dataInicio = document.getElementById('turma-data-inicio').value;
        const dataFim = document.getElementById('turma-data-fim').value;

        // Get selected students
        const cbs = document.querySelectorAll('.turma-aluno-cb:checked');
        const alunos = Array.from(cbs).map(cb => cb.value);

        if (alunos.length === 0) throw new Error('Selecione pelo menos um aluno.');

        const turmaId = `${y}_${discId}_${periodo.replace(/\./g, '-')}`;

        // Check if turma already exists
        const existing = await _(L(u, 'turmas', turmaId));
        if (existing.exists()) throw new Error(`Já existe uma turma "${nome}" para "${discData.nome}" no período ${periodo}.`);

        await Y(L(u, 'turmas', turmaId), {
          nome: nome,
          cursoId: y,
          disciplinaId: discId,
          disciplinaNome: discData.nome,
          professorNome: professor || 'Não definido',
          periodo: periodo,
          status: 'ativa',
          dataInicio: dataInicio,
          dataFim: dataFim,
          alunos: alunos,
          criadoEm: H(),
          criadoPor: I?.nome || 'Coordenador',
        });

        f(`Turma "${nome}" criada com ${alunos.length} aluno(s)!`, 'success');
        document.getElementById('nova-turma-modal').classList.add('hidden');
        form.reset();
        document.getElementById('turma-nome').value = 'Turma 2026.1';
        document.getElementById('turma-periodo').value = '2026.1';
        await carregarTurmasGestao();
      } catch (err) {
        console.error('Erro ao criar turma:', err);
        f(err.message || 'Erro ao criar turma.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = btnText;
      }
    };
  }
}

// Hook into coordinator dashboard load (called from ie function)
const originalIe = ie;
async function ieWithTurmas(a, e) {
  await originalIe(a, e);
  if (a === 'coordenador') {
    await carregarTurmasGestao();
    setupNovaTurmaModal();
  }
}
// Replace the function reference — search for where ie is called
// Actually, we'll use a simpler approach: observe when coord dashboard becomes visible
const turmasObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    if (m.type === 'attributes' && m.attributeName === 'class') {
      const el = document.getElementById('coordenador-dashboard');
      if (el && !el.classList.contains('hidden')) {
        setTimeout(() => {
          carregarTurmasGestao();
          setupNovaTurmaModal();
        }, 500);
      }
    }
  });
});
const coordDash = document.getElementById('coordenador-dashboard');
if (coordDash) {
  turmasObserver.observe(coordDash, { attributes: true, attributeFilter: ['class'] });
}

// ============ GERENCIAR ALUNOS DA TURMA ============
let turmaEditandoId = null;
let turmaEditandoData = null;

async function abrirGerenciarTurma(turmaId) {
  turmaEditandoId = turmaId;
  const modal = document.getElementById('gerenciar-turma-modal');
  const titulo = document.getElementById('gerenciar-turma-titulo');
  const atuaisContainer = document.getElementById('gerenciar-alunos-atuais');
  const disponiveisContainer = document.getElementById('gerenciar-alunos-disponiveis');
  const countEl = document.getElementById('gerenciar-count-atuais');

  atuaisContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Carregando...</p>';
  disponiveisContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Carregando...</p>';
  modal.classList.remove('hidden');
  lucide.createIcons();

  try {
    // Buscar dados da turma
    const turmaDoc = await _(L(u, 'turmas', turmaId));
    if (!turmaDoc.exists()) {
      f('Turma não encontrada.', 'error');
      modal.classList.add('hidden');
      return;
    }
    turmaEditandoData = { id: turmaId, ...turmaDoc.data() };
    const alunosDaTurma = turmaEditandoData.alunos || [];

    titulo.textContent = `${turmaEditandoData.disciplinaNome} — ${turmaEditandoData.nome} (${turmaEditandoData.periodo})`;

    // Buscar todos os alunos do curso
    const alunosSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const todosAlunos = [];
    alunosSnap.forEach(d => { todosAlunos.push({ id: d.id, ...d.data() }); });
    todosAlunos.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    // Buscar turmas concluídas da mesma disciplina para excluir alunos
    const turmasConcluidasSnap = await D($(C(u, 'turmas'), v('disciplinaId', '==', turmaEditandoData.disciplinaId), v('status', '==', 'concluída')));
    const alunosJaFizeram = new Set();
    turmasConcluidasSnap.forEach(d => {
      const data = d.data();
      (data.alunos || []).forEach(uid => alunosJaFizeram.add(uid));
    });

    // Separar alunos: na turma vs disponíveis
    const naTurma = todosAlunos.filter(a => alunosDaTurma.includes(a.id));
    const disponiveis = todosAlunos.filter(a => !alunosDaTurma.includes(a.id) && !alunosJaFizeram.has(a.id));

    // Renderizar alunos na turma
    countEl.textContent = naTurma.length;
    if (naTurma.length === 0) {
      atuaisContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Nenhum aluno nesta turma ainda.</p>';
    } else {
      atuaisContainer.innerHTML = '';
      naTurma.forEach(aluno => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-emerald-50 rounded-lg';
        div.innerHTML = `
          <span class="text-sm text-gray-700 font-medium">${aluno.nome || aluno.cpf}</span>
          <button onclick="removerAlunoDaTurma('${aluno.id}', this)" class="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 hover:bg-red-50 rounded transition">Remover</button>
        `;
        atuaisContainer.appendChild(div);
      });
    }

    // Renderizar alunos disponíveis
    if (disponiveis.length === 0) {
      disponiveisContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Todos os alunos do curso já estão nesta turma ou já concluíram a disciplina.</p>';
    } else {
      disponiveisContainer.innerHTML = '';
      disponiveis.forEach(aluno => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-purple-50 transition';
        div.id = `disp-${aluno.id}`;
        div.innerHTML = `
          <span class="text-sm text-gray-700">${aluno.nome || aluno.cpf}</span>
          <button onclick="adicionarAlunoNaTurma('${aluno.id}', '${(aluno.nome || aluno.cpf).replace(/'/g, '')}')" class="text-xs text-purple-600 hover:text-purple-800 font-bold px-2 py-1 hover:bg-purple-100 rounded transition">+ Adicionar</button>
        `;
        disponiveisContainer.appendChild(div);
      });
    }

  } catch (err) {
    console.error('Erro ao abrir gerenciar turma:', err);
    f('Erro ao carregar dados da turma.', 'error');
  }
}

window.removerAlunoDaTurma = function (alunoId, btn) {
  if (!turmaEditandoData) return;
  turmaEditandoData.alunos = (turmaEditandoData.alunos || []).filter(id => id !== alunoId);
  btn.closest('div').remove();
  document.getElementById('gerenciar-count-atuais').textContent = turmaEditandoData.alunos.length;
  f('Aluno removido (salve para confirmar).', 'warning');
};

window.adicionarAlunoNaTurma = function (alunoId, alunoNome) {
  if (!turmaEditandoData) return;
  if (!turmaEditandoData.alunos) turmaEditandoData.alunos = [];
  if (turmaEditandoData.alunos.includes(alunoId)) return;

  turmaEditandoData.alunos.push(alunoId);

  // Mover da lista de disponíveis para atuais
  const dispEl = document.getElementById(`disp-${alunoId}`);
  if (dispEl) dispEl.remove();

  const atuaisContainer = document.getElementById('gerenciar-alunos-atuais');
  // Remove "nenhum aluno" message if present
  const emptyMsg = atuaisContainer.querySelector('p');
  if (emptyMsg) emptyMsg.remove();

  const div = document.createElement('div');
  div.className = 'flex items-center justify-between p-2 bg-emerald-50 rounded-lg';
  div.innerHTML = `
    <span class="text-sm text-gray-700 font-medium">${alunoNome}</span>
    <button onclick="removerAlunoDaTurma('${alunoId}', this)" class="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 hover:bg-red-50 rounded transition">Remover</button>
  `;
  atuaisContainer.appendChild(div);

  document.getElementById('gerenciar-count-atuais').textContent = turmaEditandoData.alunos.length;
  f(`${alunoNome} adicionado!`, 'success');
};

window.salvarAlunosTurma = async function () {
  if (!turmaEditandoId || !turmaEditandoData) return;

  try {
    await O(L(u, 'turmas', turmaEditandoId), { alunos: turmaEditandoData.alunos || [] });
    f(`Turma atualizada com ${turmaEditandoData.alunos.length} aluno(s)!`, 'success');
    document.getElementById('gerenciar-turma-modal').classList.add('hidden');
    await carregarTurmasGestao();
  } catch (err) {
    console.error('Erro ao salvar alunos:', err);
    f('Erro ao salvar alterações.', 'error');
  }
};

// ============ FASE 3: CHAMADA POR TURMA ============
let turmasChamadaCache = [];

// Populate turma select in chamada panel
async function popularTurmasChamada() {
  const select = document.getElementById('turma-select-chamada');
  if (!select) return;

  select.innerHTML = '<option value="">Todas (modo legado)</option>';

  try {
    const snap = await D($(C(u, 'turmas'), v('cursoId', '==', y), v('status', '==', 'ativa')));
    turmasChamadaCache = [];
    const seen = new Set();
    snap.forEach(d => {
      if (seen.has(d.id)) return;
      seen.add(d.id);
      const data = d.data();
      if ((data.alunos || []).length > 0) {
        turmasChamadaCache.push({ id: d.id, ...data });
      }
    });
    turmasChamadaCache.sort((a, b) => (a.disciplinaNome || '').localeCompare(b.disciplinaNome || ''));

    turmasChamadaCache.forEach(t => {
      const numAlunos = (t.alunos || []).length;
      select.innerHTML += `<option value="${t.id}">${t.disciplinaNome} — ${t.nome} (${numAlunos} alunos)</option>`;
    });
  } catch (err) {
    console.error('Erro ao carregar turmas para chamada:', err);
  }
}

// When turma is selected, auto-fill discipline
window.onTurmaChamadaChange = function () {
  const turmaId = document.getElementById('turma-select-chamada').value;
  if (!turmaId) return;

  const turma = turmasChamadaCache.find(t => t.id === turmaId);
  if (!turma) return;

  // Auto-select the discipline
  const discSelect = document.getElementById('disciplina-select-chamada');
  if (discSelect) {
    // Find the option that matches this discipline name
    const discData = Array.from(U.values()).find(d => d.id === turma.disciplinaId);
    if (discData) {
      discSelect.value = discData.nome;
    } else {
      // Try matching by name
      for (const opt of discSelect.options) {
        if (opt.value === turma.disciplinaNome) {
          discSelect.value = opt.value;
          break;
        }
      }
    }
  }

  // Trigger loading
  be();
};

// Hook: populate turma select when chamada panel opens
const chamadaPanel = document.getElementById('panel-chamada');
if (chamadaPanel) {
  const chamadaObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (!chamadaPanel.classList.contains('hidden')) {
          popularTurmasChamada();
        }
      }
    });
  });
  chamadaObserver.observe(chamadaPanel, { attributes: true, attributeFilter: ['class'] });
}

// ============ FASE 4: NOTAS POR TURMA ============

// Populate turma select in notas panel
let turmasNotasPopulated = false;
async function popularTurmasNotas() {
  const select = document.getElementById('turma-select-notas');
  if (!select) return;
  if (turmasNotasPopulated) return;
  turmasNotasPopulated = true;

  select.innerHTML = '<option value="">Todas (modo legado)</option>';

  try {
    const snap = await D($(C(u, 'turmas'), v('cursoId', '==', y), v('status', '==', 'ativa')));
    const turmasNotas = [];
    const seen = new Set();
    snap.forEach(d => {
      if (seen.has(d.id)) return;
      seen.add(d.id);
      const data = d.data();
      // Only show turmas that have students
      if ((data.alunos || []).length > 0) {
        turmasNotas.push({ id: d.id, ...data });
      }
    });
    turmasNotas.sort((a, b) => (a.disciplinaNome || '').localeCompare(b.disciplinaNome || ''));

    turmasNotas.forEach(t => {
      const numAlunos = (t.alunos || []).length;
      select.innerHTML += `<option value="${t.id}" data-disc-nome="${t.disciplinaNome}">${t.disciplinaNome} — ${t.nome} (${numAlunos} alunos)</option>`;
    });
  } catch (err) {
    console.error('Erro ao carregar turmas para notas:', err);
  }
}

// When turma is selected in notas, auto-fill discipline and filter students
window.onTurmaNotasChange = async function () {
  const turmaSelect = document.getElementById('turma-select-notas');
  const turmaId = turmaSelect.value;

  if (!turmaId) {
    V('prof', y);
    return;
  }

  const selectedOption = turmaSelect.selectedOptions[0];
  const discNome = selectedOption?.dataset?.discNome;

  // Auto-select the discipline
  const discSelect = document.getElementById('disciplina-select-prof');
  if (discSelect && discNome) {
    for (const opt of discSelect.options) {
      if (opt.value === discNome) {
        discSelect.value = opt.value;
        break;
      }
    }
  }

  // Filter student dropdown to only turma students
  const alunoSelect = document.getElementById('aluno-select-prof');
  if (!alunoSelect) return;
  alunoSelect.innerHTML = '<option value="">Carregando...</option>';

  try {
    const turmaDoc = await _(L(u, 'turmas', turmaId));
    if (!turmaDoc.exists()) return;
    const alunosDaTurma = turmaDoc.data().alunos || [];

    if (alunosDaTurma.length === 0) {
      alunoSelect.innerHTML = '<option>Nenhum aluno nesta turma</option>';
      return;
    }

    const alunosSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const alunosMap = [];
    alunosSnap.forEach(d => {
      if (alunosDaTurma.includes(d.id)) {
        alunosMap.push({ id: d.id, nome: d.data().nome || d.data().cpf });
      }
    });
    alunosMap.sort((a, b) => a.nome.localeCompare(b.nome));

    alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
    alunosMap.forEach(a => {
      alunoSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
    });
  } catch (err) {
    console.error('Erro ao filtrar alunos por turma:', err);
    alunoSelect.innerHTML = '<option>Erro ao carregar</option>';
  }
};

// Hook: populate turma select when professor dashboard is shown
const profDash = document.getElementById('professor-dashboard');
if (profDash) {
  const profObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (!profDash.classList.contains('hidden')) {
          setTimeout(popularTurmasNotas, 500);
        }
      }
    });
  });
  profObserver.observe(profDash, { attributes: true, attributeFilter: ['class'] });
}

// ============ FASE 5: DASHBOARD ALUNO POR TURMA ============

window.filtrarNotasAluno = function (periodo) {
  const rows = document.querySelectorAll('#notas-tbody tr');
  rows.forEach(row => {
    if (row.dataset.periodo === undefined) return;
    row.style.display = (periodo === 'todos' || row.dataset.periodo === periodo) ? '' : 'none';
  });
  const container = document.getElementById('aluno-filtro-periodo-container');
  if (container) {
    container.querySelectorAll('button').forEach(btn => {
      const isActive = btn.textContent === periodo || (periodo === 'todos' && btn.id === 'filtro-periodo-todos');
      btn.className = isActive
        ? 'px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200'
        : 'px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500 border border-gray-200';
    });
  }
};

// ============ RELATÓRIO DE FREQUÊNCIA POR TURMA ============

async function popularRelatorioTurmaFilter() {
  const select = document.getElementById('relatorio-turma-filter');
  if (!select) return;
  select.innerHTML = '<option value="">Todos os alunos (sem filtro)</option>';
  try {
    const snap = await D($(C(u, 'turmas'), v('cursoId', '==', y)));
    const turmas = [];
    const seen = new Set();
    snap.forEach(d => {
      if (seen.has(d.id)) return;
      seen.add(d.id);
      turmas.push({ id: d.id, ...d.data() });
    });
    turmas.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'ativa' ? -1 : 1;
      return (a.disciplinaNome || '').localeCompare(b.disciplinaNome || '');
    });
    turmas.forEach(t => {
      const numAlunos = (t.alunos || []).length;
      const icon = t.status === 'ativa' ? '🟢' : '⚪';
      select.innerHTML += `<option value="${t.id}">${icon} ${t.disciplinaNome} — ${t.nome} (${numAlunos})</option>`;
    });
  } catch (err) { console.error('Erro turmas relatório:', err); }
}

window.filtrarRelatorioFrequencia = async function () {
  const turmaId = document.getElementById('relatorio-turma-filter').value;
  const container = document.getElementById('relatorio-conteudo');
  if (!container) return;
  if (!turmaId) {
    container.innerHTML = '<p class="text-center text-gray-400 py-8">Selecione uma turma para ver o relatório filtrado.</p>';
    return;
  }
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Carregando...</p>';
  try {
    const turmaDoc = await _(L(u, 'turmas', turmaId));
    if (!turmaDoc.exists()) { container.innerHTML = '<p class="text-center text-red-400">Turma não encontrada.</p>'; return; }
    const td = turmaDoc.data();
    const alunosDaTurma = td.alunos || [];
    const notasSnap = await D($(C(u, 'notas'), v('disciplina', '==', td.disciplinaNome), v('cursoId', '==', y)));
    const notasMap = {};
    notasSnap.forEach(d => { const data = d.data(); if (alunosDaTurma.includes(data.alunoUid)) notasMap[data.alunoUid] = data; });
    const alunosSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const nomes = {};
    alunosSnap.forEach(d => { if (alunosDaTurma.includes(d.id)) nomes[d.id] = d.data().nome || d.data().cpf || d.id; });
    let html = `<div class="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <h4 class="font-bold text-indigo-900">${td.disciplinaNome}</h4>
      <p class="text-sm text-indigo-600">${td.nome} • ${td.periodo || ''} • Prof: ${td.professorNome || '—'}</p>
    </div>
    <div class="overflow-hidden rounded-xl border border-gray-200"><table class="w-full text-left border-collapse">
      <thead class="bg-indigo-50"><tr>
        <th class="p-3 text-sm font-bold text-indigo-900">Aluno</th>
        <th class="p-3 text-sm font-bold text-indigo-900 text-center">Nota</th>
        <th class="p-3 text-sm font-bold text-indigo-900 text-center">Presenças</th>
        <th class="p-3 text-sm font-bold text-indigo-900 text-center">Faltas</th>
        <th class="p-3 text-sm font-bold text-indigo-900 text-center">Freq.</th>
        <th class="p-3 text-sm font-bold text-indigo-900 text-center">Status</th>
      </tr></thead><tbody class="divide-y divide-gray-100">`;
    const sorted = alunosDaTurma.filter(uid => nomes[uid]).sort((a, b) => nomes[a].localeCompare(nomes[b]));
    if (sorted.length === 0) { html += '<tr><td colspan="6" class="text-center p-4 text-gray-400">Nenhum aluno.</td></tr>'; }
    else sorted.forEach(uid => {
      const nome = nomes[uid], nd = notasMap[uid], nota = nd?.nota, ch = nd?.chamadas || {};
      const total = Object.keys(ch).length, faltas = Object.values(ch).filter(x => x === 'F').length;
      const pres = total - faltas, freq = total > 0 ? Math.round((pres / total) * 100) : 100;
      let st = '<span class="px-2 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-500">Cursando</span>';
      if (nota != null && nota > 0) {
        if (nota >= 7 && freq >= 75) st = '<span class="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-600">Aprovado</span>';
        else if (nota < 7) st = '<span class="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-600">Reprovado</span>';
        else if (freq < 75) st = '<span class="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-600">Rep. Freq</span>';
      }
      const fc = freq >= 75 ? 'text-green-600' : 'text-red-600';
      html += `<tr class="hover:bg-indigo-50/30"><td class="p-3 font-medium text-gray-700">${nome}</td>
        <td class="p-3 text-center font-bold">${nota != null ? nota.toFixed(1) : '—'}</td>
        <td class="p-3 text-center text-sm text-gray-600">${pres}</td>
        <td class="p-3 text-center text-sm ${faltas > 0 ? 'text-red-500 font-bold' : 'text-gray-400'}">${faltas}</td>
        <td class="p-3 text-center font-bold ${fc}">${freq}%</td>
        <td class="p-3 text-center">${st}</td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) { console.error('Erro relatório:', err); container.innerHTML = '<p class="text-center text-red-400">Erro.</p>'; }
};

const relatorioPanel = document.getElementById('panel-relatorio-coord');
if (relatorioPanel) {
  const relObs = new MutationObserver(muts => {
    muts.forEach(m => { if (m.type === 'attributes' && m.attributeName === 'class' && !relatorioPanel.classList.contains('hidden')) popularRelatorioTurmaFilter(); });
  });
  relObs.observe(relatorioPanel, { attributes: true, attributeFilter: ['class'] });
}

// ============ NOTIFICAÇÕES POR EMAIL (EmailJS) ============

// EmailJS Config
const EMAILJS_PUBLIC_KEY = '2WRJe3NbNMqxWU6zV';
const EMAILJS_SERVICE_ID = 'service_rz4fbpq';
const EMAILJS_TEMPLATE_NOTA = 'template_kri2zpj';
const EMAILJS_TEMPLATE_GERAL = 'template_b52i4zc';
const EMAILJS_COORD_EMAIL = 'racposgraduacao@gmail.com';

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  console.log('EmailJS inicializado.');
}

// Send grade notification email
async function notificarNotaPorEmail(alunoUid, disciplina, nota) {
  try {
    const alunoDoc = await _(L(u, 'utilizadores', alunoUid));
    if (!alunoDoc.exists()) return;
    const alunoData = alunoDoc.data();
    const email = alunoData.emailContato;
    if (!email) return;

    const cursoNome = F.get(y)?.nome || 'Pós-graduação RAC';
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTA, {
      to_email: email,
      to_name: alunoData.nome || 'Aluno(a)',
      disciplina: disciplina,
      nota: nota.toFixed(1),
      curso: cursoNome,
      professor: I?.nome || 'Professor(a)',
      portal_url: 'https://portal.racposgraduacao.com.br/',
    });
    console.log('[Email] Nota → aluno:', email);
  } catch (err) {
    console.warn('[Email] Erro notificação nota:', err);
  }
}

// Notify coordinator when student submits a requirement
async function notificarRequerimentoEnviado(assunto, mensagem, alunoNome) {
  try {
    const cursoNome = F.get(y)?.nome || 'Pós-graduação RAC';
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_GERAL, {
      to_email: EMAILJS_COORD_EMAIL,
      to_name: 'Coordenação',
      subject: '📋 Novo requerimento - ' + alunoNome,
      title: '📋 Novo Requerimento',
      message: `O aluno(a) ${alunoNome} enviou um requerimento no curso ${cursoNome}:`,
      detail: `Assunto: ${assunto}\n\n${mensagem}`,
    });
    console.log('[Email] Requerimento → coordenador');
  } catch (err) {
    console.warn('[Email] Erro notificação requerimento:', err);
  }
}

// Notify student when coordinator responds to a requirement
async function notificarRequerimentoRespondido(alunoUid, assunto, resposta) {
  try {
    const alunoDoc = await _(L(u, 'utilizadores', alunoUid));
    if (!alunoDoc.exists()) return;
    const alunoData = alunoDoc.data();
    const email = alunoData.emailContato;
    if (!email) return;

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_GERAL, {
      to_email: email,
      to_name: alunoData.nome || 'Aluno(a)',
      subject: '✅ Requerimento respondido - ' + assunto,
      title: '✅ Requerimento Respondido',
      message: `Seu requerimento "${assunto}" foi respondido pela coordenação:`,
      detail: resposta,
    });
    console.log('[Email] Resposta requerimento → aluno:', email);
  } catch (err) {
    console.warn('[Email] Erro notificação resposta:', err);
  }
}

// Notify student when coordinator uploads a document
async function notificarDocumentoEnviado(alunoUid, tipoDocumento) {
  try {
    const alunoDoc = await _(L(u, 'utilizadores', alunoUid));
    if (!alunoDoc.exists()) return;
    const alunoData = alunoDoc.data();
    const email = alunoData.emailContato;
    if (!email) return;

    const cursoNome = F.get(y)?.nome || 'Pós-graduação RAC';
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_GERAL, {
      to_email: email,
      to_name: alunoData.nome || 'Aluno(a)',
      subject: '📄 Novo documento disponível - ' + tipoDocumento,
      title: '📄 Novo Documento Disponível',
      message: `A coordenação do curso ${cursoNome} disponibilizou um novo documento para você:`,
      detail: `Tipo de documento: ${tipoDocumento}\n\nVocê já pode visualizá-lo e baixá-lo acessando o seu portal do aluno.`,
      portal_url: 'https://portal.racposgraduacao.com.br/',
    });
    console.log(`[Email] ${tipoDocumento} → aluno:`, email);
  } catch (err) {
    console.warn('[Email] Erro notificação documento:', err);
  }
}

// ============ EMAIL DE CONTATO DO ALUNO ============

window.salvarEmailAluno = async function (email) {
  if (!I) return;
  const statusEl = document.getElementById('aluno-email-status');
  try {
    await O(L(u, 'utilizadores', I.id), { emailContato: email });
    if (statusEl) {
      statusEl.textContent = '✅ Salvo!';
      statusEl.className = 'text-[10px] text-emerald-600 font-bold';
      setTimeout(() => { statusEl.textContent = ''; }, 3000);
    }
    I.emailContato = email;
  } catch (err) {
    console.error('Erro ao salvar email:', err);
    if (statusEl) {
      statusEl.textContent = '❌ Erro';
      statusEl.className = 'text-[10px] text-red-500 font-bold';
    }
  }
};

function carregarEmailAluno() {
  if (!I) return;
  const input = document.getElementById('aluno-email-input');
  if (input && I.emailContato) {
    input.value = I.emailContato;
  }
}

// Hook: carregar email quando aluno dashboard mostra
const alunoDashEmail = document.getElementById('aluno-dashboard');
if (alunoDashEmail) {
  const emailObs = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class' && !alunoDashEmail.classList.contains('hidden')) {
        setTimeout(carregarEmailAluno, 600);
      }
    });
  });
  emailObs.observe(alunoDashEmail, { attributes: true, attributeFilter: ['class'] });
}

// ============ EXCLUIR USUÁRIO ============

window.excluirUsuario = async function () {
  const select = document.getElementById('aluno-select-ficha');
  if (!select || !select.value) {
    f('Selecione um aluno primeiro.', 'error');
    return;
  }
  const alunoId = select.value;
  const alunoLabel = select.selectedOptions[0]?.textContent || 'Aluno';

  if (!confirm('⚠️ ATENÇÃO!\n\nVocê vai EXCLUIR:\n' + alunoLabel + '\n\nIsso removerá dados, notas e turmas.\nEssa ação NÃO pode ser desfeita.\n\nContinuar?')) return;
  const confirmText = prompt('Para confirmar, digite "EXCLUIR" (maiúsculas):');
  if (confirmText !== 'EXCLUIR') {
    f('Exclusão cancelada.', 'warning');
    return;
  }

  try {
    f('Excluindo aluno...', 'warning');

    // 1. Delete notas
    const notasSnap = await D($(C(u, 'notas'), v('alunoUid', '==', alunoId), v('cursoId', '==', y)));
    const batch1 = De(u);
    let count = 0;
    notasSnap.forEach(d => { batch1.delete(d.ref); count++; });
    if (count > 0) await batch1.commit();

    // 2. Remove from turmas
    const turmasSnap = await D($(C(u, 'turmas'), v('cursoId', '==', y)));
    const turmasToUpdate = [];
    turmasSnap.forEach(td => {
      const tData = td.data();
      if ((tData.alunos || []).includes(alunoId)) {
        turmasToUpdate.push(td);
      }
    });
    for (let i = 0; i < turmasToUpdate.length; i++) {
      const td = turmasToUpdate[i];
      const tData = td.data();
      await O(td.ref, { alunos: (tData.alunos || []).filter(uid => uid !== alunoId) });
    }

    // 3. Delete user document
    await Ne(L(u, 'utilizadores', alunoId));
    f('Aluno excluído com sucesso!', 'success');
    V('ficha', y);
  } catch (err) {
    console.error('Erro ao excluir:', err);
    f('Erro ao excluir: ' + err.message, 'error');
  }
};

// ============ DOCUMENTOS: UPLOAD & DOWNLOAD ============

// --- DECLARAÇÃO CUSTOMIZADA (por aluno) ---
// Path: declaracoes/{cursoId}/{alunoUid}.pdf

window.uploadDeclaracao = async function (input) {
  const file = input.files[0];
  if (!file) return;
  const alunoId = document.getElementById('declaracao-aluno-select').value;
  if (!alunoId) {
    f('Selecione um aluno primeiro.', 'error');
    return;
  }
  const statusEl = document.getElementById('declaracao-upload-status');
  statusEl.textContent = 'Enviando...';
  statusEl.className = 'text-[10px] text-blue-500 font-bold';

  try {
    const path = `declaracoes/${y}/${alunoId}.pdf`;
    const storageRef = sr(st, path);
    await ub(storageRef, file);
    statusEl.textContent = '✅ Enviado!';
    statusEl.className = 'text-[10px] text-emerald-600 font-bold';
    const alunoNome = document.getElementById('declaracao-aluno-select').selectedOptions[0]?.textContent || 'Aluno';
    f(`Declaração de ${alunoNome} enviada!`, 'success');
    // Notificar aluno por email
    notificarDocumentoEnviado(alunoId, 'Declaração de Matrícula').catch(e => console.warn(e));
  } catch (err) {
    console.error('Erro upload declaração:', err);
    statusEl.textContent = '❌ Erro';
    statusEl.className = 'text-[10px] text-red-500 font-bold';
    f('Erro ao enviar: ' + err.message, 'error');
  }
};

// Check if custom declaration exists for a specific student
async function getDeclaracaoCustomURL(alunoUid) {
  try {
    const uid = alunoUid || (I ? I.id : null);
    if (!uid) return null;
    const path = `declaracoes/${y}/${uid}.pdf`;
    const storageRef = sr(st, path);
    return await gdu(storageRef);
  } catch (err) {
    return null;
  }
}

// --- CARTEIRINHA (por aluno) ---
// Path: carteirinhas/{cursoId}/{alunoUid}.pdf

window.uploadCarteirinha = async function (input) {
  const file = input.files[0];
  if (!file) return;
  const alunoId = document.getElementById('carteirinha-aluno-select').value;
  if (!alunoId) {
    f('Selecione um aluno primeiro.', 'error');
    return;
  }
  const statusEl = document.getElementById('carteirinha-upload-status');
  statusEl.textContent = 'Enviando...';
  statusEl.className = 'text-[10px] text-blue-500 font-bold';

  try {
    const path = `carteirinhas/${y}/${alunoId}.pdf`;
    const storageRef = sr(st, path);
    await ub(storageRef, file);
    statusEl.textContent = '✅ Enviado!';
    statusEl.className = 'text-[10px] text-emerald-600 font-bold';
    const alunoNome = document.getElementById('carteirinha-aluno-select').selectedOptions[0]?.textContent || 'Aluno';
    f(`Carteirinha de ${alunoNome} enviada!`, 'success');
    // Notificar aluno por email
    notificarDocumentoEnviado(alunoId, 'Carteirinha de Estudante').catch(e => console.warn(e));
  } catch (err) {
    console.error('Erro upload carteirinha:', err);
    statusEl.textContent = '❌ Erro';
    statusEl.className = 'text-[10px] text-red-500 font-bold';
    f('Erro ao enviar: ' + err.message, 'error');
  }
};

// Check if student ID card exists
async function getCarteirinhaURL(alunoUid, cursoId) {
  try {
    const path = `carteirinhas/${cursoId}/${alunoUid}.pdf`;
    const storageRef = sr(st, path);
    return await gdu(storageRef);
  } catch (err) {
    return null;
  }
}

// Populate document selects with students
async function popularDocumentosSelects() {
  const selects = ['carteirinha-aluno-select', 'declaracao-aluno-select'];

  try {
    const snap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const alunos = [];
    snap.forEach(d => alunos.push({ id: d.id, nome: d.data().nome || d.data().cpf }));
    alunos.sort((a, b) => a.nome.localeCompare(b.nome));

    selects.forEach(selectId => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.innerHTML = '<option value="">Selecione o aluno...</option>';
      alunos.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
      });
    });
  } catch (err) {
    console.error('Erro ao popular selects de documentos:', err);
  }
}

window.visualizarDocumento = async function (tipo) {
    const selectId = tipo === 'declaracao' ? 'declaracao-aluno-select' : 'carteirinha-aluno-select';
    const alunoId = document.getElementById(selectId).value;
    if (!alunoId) {
        f('Selecione um aluno primeiro.', 'error');
        return;
    }
    try {
        const path = tipo === 'declaracao' ? `declaracoes/${y}/${alunoId}.pdf` : `carteirinhas/${y}/${alunoId}.pdf`;
        const storageRef = sr(st, path);
        const url = await gdu(storageRef);
        window.open(url, '_blank');
    } catch (err) {
        console.error('Erro ao visualizar documento:', err);
        f('Documento não encontrado para este aluno.', 'error');
    }
};

// Hook: populate carteirinha select when coord dashboard loads
const coordDashDoc = document.getElementById('coordenador-dashboard');
if (coordDashDoc) {
  const docObserver = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class' && !coordDashDoc.classList.contains('hidden')) {
        setTimeout(() => {
          popularDocumentosSelects();
        }, 500);
      }
    });
  });
  docObserver.observe(coordDashDoc, { attributes: true, attributeFilter: ['class'] });
}

// --- ALUNO: Verificar carteirinha e declaração ---

async function verificarDocumentosAluno(alunoUid, cursoId) {
  // Check carteirinha
  const cartBtn = document.getElementById('carteirinha-btn');
  const cartStatus = document.getElementById('carteirinha-status');
  if (cartBtn && cartStatus) {
    const cartUrl = await getCarteirinhaURL(alunoUid, cursoId);
    if (cartUrl) {
      cartStatus.textContent = 'Disponível';
      cartStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600';
      cartBtn.onclick = () => window.open(cartUrl, '_blank');
    } else {
      cartStatus.textContent = 'Em breve';
      cartStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400';
      cartBtn.onclick = () => f('Sua carteirinha ainda não está disponível. Aguarde a emissão pela coordenação.', 'warning');
    }
  }
}

// Hook: check docs when aluno dashboard shows
const alunoDashDoc = document.getElementById('aluno-dashboard');
if (alunoDashDoc) {
  const alunoDocObserver = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class' && !alunoDashDoc.classList.contains('hidden')) {
        if (I && y) {
          setTimeout(() => verificarDocumentosAluno(I.id, y), 500);
        }
      }
    });
  });
  alunoDocObserver.observe(alunoDashDoc, { attributes: true, attributeFilter: ['class'] });
}


// ============ COORDINATOR GRADES LOGIC (Added by Antigravity) ============
let turmasNotasCoordPopulated = false;
async function popularTurmasNotasCoord() {
  const select = document.getElementById('turma-select-notas-coord');
  if (!select) return;
  if (turmasNotasCoordPopulated) return;
  turmasNotasCoordPopulated = true;

  select.innerHTML = '<option value="">Todas as Turmas</option>';

  try {
    const snap = await D($(C(u, 'turmas'), v('cursoId', '==', y), v('status', '==', 'ativa')));
    const turmasNotas = [];
    snap.forEach(d => {
      const data = d.data();
      if ((data.alunos || []).length > 0) {
        turmasNotas.push({ id: d.id, ...data });
      }
    });
    turmasNotas.sort((a, b) => (a.disciplinaNome || '').localeCompare(b.disciplinaNome || ''));

    turmasNotas.forEach(t => {
      const numAlunos = (t.alunos || []).length;
      select.innerHTML += `<option value="${t.id}" data-disc-nome="${t.disciplinaNome}">${t.disciplinaNome} — ${t.nome} (${numAlunos} alunos)</option>`;
    });
  } catch (err) {
    console.error('Erro ao carregar turmas para notas (coord):', err);
    turmasNotasCoordPopulated = false; 
  }
}

window.onTurmaNotasChangeCoord = async function () {
  const turmaSelect = document.getElementById('turma-select-notas-coord');
  const turmaId = turmaSelect.value;

  if (!turmaId) {
    V('coord', y);
    return;
  }

  const selectedOption = turmaSelect.selectedOptions[0];
  const discNome = selectedOption?.dataset?.discNome;

  const discSelect = document.getElementById('disciplina-select-coord');
  if (discSelect && discNome) {
    for (const opt of discSelect.options) {
      if (opt.value === discNome) {
        discSelect.value = opt.value;
        break;
      }
    }
  }

  const alunoSelect = document.getElementById('aluno-select-coord');
  if (!alunoSelect) return;
  alunoSelect.innerHTML = '<option value="">Carregando...</option>';

  try {
    const turmaDoc = await _(L(u, 'turmas', turmaId));
    if (!turmaDoc.exists()) return;
    const alunosDaTurma = turmaDoc.data().alunos || [];

    if (alunosDaTurma.length === 0) {
      alunoSelect.innerHTML = '<option>Nenhum aluno nesta turma</option>';
      return;
    }

    const alunosSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
    const alunosMap = [];
    alunosSnap.forEach(d => {
      if (alunosDaTurma.includes(d.id)) {
        alunosMap.push({ id: d.id, nome: d.data().nome || d.data().cpf });
      }
    });
    alunosMap.sort((a, b) => a.nome.localeCompare(b.nome));

    alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
    alunosMap.forEach(a => {
      alunoSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
    });
  } catch (err) {
    console.error('Erro ao filtrar alunos por turma (coord):', err);
    alunoSelect.innerHTML = '<option>Erro ao carregar</option>';
  }
};

const coordDash = document.getElementById('coordenador-dashboard');
if (coordDash) {
  const coordObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (!coordDash.classList.contains('hidden')) {
           // Small delay to ensure curso selection (y) is ready
           setTimeout(popularTurmasNotasCoord, 800);
           // Also ensure selects are initialized
           V('coord', y);
           J('coord');
        } else {
           turmasNotasCoordPopulated = false; // Reset when dashboard hidden to allow refresh when coming back
        }
      }
    });
  });
  coordObserver.observe(coordDash, { attributes: true, attributeFilter: ['class'] });
}

// ============ MASS LAUNCH LOGIC (Added by Antigravity) ============

window.ativarModoMassa = async function() {
    console.log('Botão Modo Massa clicado');
    const turmaId = document.getElementById('turma-select-notas-coord').value;
    const alunoId = document.getElementById('aluno-select-coord').value;
    console.log('Contexto:', { turmaId, alunoId });

    const container = document.getElementById('mass-launch-container');
    const individual = document.getElementById('individual-launch-container');
    const tbody = document.getElementById('mass-launch-tbody');
    const title = document.getElementById('mass-launch-title');
    const subtitle = document.getElementById('mass-launch-subtitle');
    const thItem = document.getElementById('mass-th-item');
    const thContext = document.getElementById('mass-th-context');

    tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-gray-500"><div class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status"><span class="sr-only">Carregando...</span></div><p class="mt-2">Carregando dados...</p></td></tr>';
    individual.classList.add('hidden');
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth' });

    try {
        if (turmaId) {
            const turmaDoc = await _(L(u, 'turmas', turmaId));
            const turmaData = turmaDoc.data();
            const alunosIds = turmaData.alunos || [];
            const disciplina = turmaData.disciplinaNome;

            title.textContent = `Lançamento em Massa: ${disciplina}`;
            subtitle.textContent = `Turma: ${turmaData.nome} (${alunosIds.length} alunos)`;
            thItem.textContent = 'Estudante';
            thContext.textContent = 'CPF do Aluno';

            const studentsSnap = await D($(C(u, 'utilizadores'), v('role', '==', 'aluno'), v('cursos', 'array-contains', y)));
            const studentsMap = [];
            studentsSnap.forEach(d => {
                if (alunosIds.includes(d.id)) studentsMap.push({id: d.id, ...d.data()});
            });
            studentsMap.sort((a,b) => (a.nome || '').localeCompare(b.nome || ''));

            if (studentsMap.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-gray-400">Nenhum aluno encontrado para esta turma.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            studentsMap.forEach(s => {
                tbody.innerHTML += `
                    <tr>
                        <td class="p-4 font-bold text-gray-700">${s.nome}</td>
                        <td class="p-4 text-xs text-gray-500">${s.cpf || '-'}</td>
                        <td class="p-4 border-l">
                            <input type="number" step="0.1" min="0" max="10" 
                                class="w-full p-2 text-center text-lg font-bold border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                                data-alunouid="${s.id}" data-disciplina="${disciplina}" placeholder="0.0">
                        </td>
                    </tr>
                `;
            });
        } else if (alunoId) {
            const alunoDoc = await _(L(u, 'utilizadores', alunoId));
            const alunoData = alunoDoc.data();

            title.textContent = `Lançamento em Massa: ${alunoData.nome}`;
            subtitle.textContent = `Atribua notas para as várias disciplinas do curso.`;
            thItem.textContent = 'Disciplina';
            thContext.textContent = 'Professor Responsável';

            const disciplines = Array.from(U.values()).sort((a,b) => a.nome.localeCompare(b.nome));

            if (disciplines.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-gray-400">Nenhuma disciplina cadastrada neste curso.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            disciplines.forEach(d => {
                tbody.innerHTML += `
                    <tr>
                        <td class="p-4 font-bold text-gray-700">${d.nome}</td>
                        <td class="p-4 text-xs text-gray-500">${d.professor || '-'}</td>
                        <td class="p-4 border-l">
                            <input type="number" step="0.1" min="0" max="10" 
                                class="w-full p-2 text-center text-lg font-bold border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                                data-alunouid="${alunoId}" data-disciplina="${d.nome}" placeholder="0.0">
                        </td>
                    </tr>
                `;
            });
        } else {
            f('Selecione primeiro uma Turma ou um Aluno para entrar no modo em massa.', 'info');
            desativarModoMassa();
        }
    } catch (err) {
        console.error('Erro modo massa:', err);
        tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-red-500">Erro ao carregar dados. Verifique a conexão.</td></tr>';
    }
};

window.desativarModoMassa = function() {
    document.getElementById('mass-launch-container').classList.add('hidden');
    document.getElementById('individual-launch-container').classList.remove('hidden');
    document.getElementById('panel-notas-coord').scrollIntoView({ behavior: 'smooth' });
};

window.salvarNotasMassa = async function() {
    const inputs = document.querySelectorAll('#mass-launch-tbody input');
    const batch = De(u);
    let count = 0;
    const notifications = {}; 

    const btn = document.getElementById('btn-salvar-massa');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="animate-spin grayscale opacity-70 w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div> Salvando...';

    try {
        inputs.forEach(input => {
            const val = input.value.trim();
            if (val !== "") {
                const nota = parseFloat(val);
                if (!isNaN(nota) && nota >= 0 && nota <= 10) {
                    const alunoUid = input.dataset.alunouid;
                    const disciplina = input.dataset.disciplina;
                    const docId = `${alunoUid}_${disciplina.replace(/\s+/g, "-")}`;
                    
                    batch.set(L(u, 'notas', docId), {
                        alunoUid,
                        disciplina,
                        nota,
                        cursoId: y,
                        atualizadaEm: H(),
                        lancadoPor: I.nome || "Coordenação"
                    }, { merge: true });

                    count++;
                    if (!notifications[alunoUid]) notifications[alunoUid] = [];
                    notifications[alunoUid].push({ disciplina, nota });
                }
            }
        });

        if (count === 0) {
            f('Nenhuma nota válida preenchida.', 'info');
            btn.disabled = false;
            btn.innerHTML = originalContent;
            return;
        }

        await batch.commit();
        f(`${count} notas lançadas com sucesso e enviadas para o email dos alunos!`, 'success');
        desativarModoMassa();

        // Agrupar notificações por aluno
        for (const uid in notifications) {
            notificarVariasNotasPorEmail(uid, notifications[uid]);
        }

    } catch (err) {
        console.error('Erro salvar massa:', err);
        f('Erro crítico ao salvar notas: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
};

async function notificarVariasNotasPorEmail(alunoUid, notasArray) {
    if (!notasArray || notasArray.length === 0) return;
    try {
        // Obter dados do aluno
        const alunoSnap = await _(L(u, 'utilizadores', alunoUid));
        const aluno = alunoSnap.exists() ? alunoSnap.data() : null;
        if (!aluno || !aluno.emailContato) return;

        const cursoNome = F.get(y)?.nome || 'Pós-graduação RAC';
        
        let listaHtml = notasArray.map(n => `<li><b>${n.disciplina}</b>: ${n.nota.toFixed(1)}</li>`).join('');
        const detail = `<ul style="list-style: none; padding: 0;">${listaHtml}</ul>`;

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_GERAL, {
            to_email: aluno.emailContato,
            to_name: aluno.nome || 'Aluno(a)',
            subject: `🎓 Suas notas foram atualizadas - ${cursoNome}`,
            title: '🎓 Atualização de Notas',
            message: `Olá, ${aluno.nome || 'aluno(a)'}. Novas avaliações foram registradas em seu portal para o curso ${cursoNome}:`,
            detail: detail,
            portal_url: 'https://portal.racposgraduacao.com.br/'
        });
        console.log('[Email Massa] Sincronizado para:', aluno.emailContato);
    } catch (err) {
        console.warn('[Email Massa] Falha no envio:', err);
    }
}

// Event listener for the mass launch button (Added to ensure it works)
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-modo-massa')) {
        console.log('Click detectado pelo listener global');
        ativarModoMassa();
    }
});
