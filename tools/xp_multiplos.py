"""Converte o PDF "Tabela de Múltiplos" do Research XP em central/mercado/dados-xp.js.

Uso: python3 tools/xp_multiplos.py caminho/para/XP-Tabela-de-Multiplos.pdf
Requer o utilitário pdftotext (poppler-utils).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

SAIDA = Path(__file__).resolve().parent.parent / "central" / "mercado" / "dados-xp.js"
RECS = {"Compra", "Neutro", "Venda", "Sob Revisão", "Restrito"}


def texto(pdf, pagina):
    return subprocess.run(
        ["pdftotext", "-layout", "-f", str(pagina), "-l", str(pagina), pdf, "-"],
        capture_output=True, text=True, check=True,
    ).stdout


def num(s):
    s = s.strip()
    if s in ("-", "", "inf", "n.a."):
        return None
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()").replace("x", "").replace("%", "").replace(".", "").replace(",", ".")
    try:
        v = float(s)
    except ValueError:
        return None
    return -v if neg else v


def linhas(pdf, total_paginas):
    """Separa as linhas das duas tabelas pelo número de colunas (20 = múltiplos, 19 = operacionais)."""
    mult, ops, ruins = [], [], []
    for p in range(1, total_paginas + 1):
        for linha in texto(pdf, p).splitlines():
            partes = [x for x in re.split(r"\s{2,}", linha.strip()) if x]
            if len(partes) < 5 or partes[4] not in RECS:
                continue
            if len(partes) == 20:
                mult.append(partes)
            elif len(partes) == 19:
                ops.append(partes)
            else:
                ruins.append(linha.strip())
    return mult, ops, ruins


def main():
    pdf = sys.argv[1]
    info = subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout
    paginas = int(re.search(r"Pages:\s+(\d+)", info).group(1))
    m = re.search(r"Dados de\s+(\d{2}/\d{2}/\d{4})", texto(pdf, 1))
    data_base = m.group(1) if m else "?"

    mult, ops, ruins = linhas(pdf, paginas)
    empresas = {}
    for r in mult:
        empresas[r[1]] = {
            "nome": r[0], "ticker": r[1], "setor": r[2], "analista": r[3], "rec": r[4],
            "alvo": num(r[5]), "preco": num(r[6]),
            "pl26": num(r[8]), "pl27": num(r[9]), "ev26": num(r[10]), "ev27": num(r[11]),
            "dl26": num(r[12]), "dl27": num(r[13]), "pvp26": num(r[14]), "pvp27": num(r[15]),
            "roe26": num(r[16]), "roe27": num(r[17]), "dy26": num(r[18]), "dy27": num(r[19]),
        }
    for r in ops:
        e = empresas.setdefault(r[1], {"nome": r[0], "ticker": r[1], "setor": r[2], "rec": r[4]})
        e.update({
            "mcap": num(r[8]), "receita26": num(r[9]), "receita27": num(r[10]),
            "ebitda26": num(r[11]), "ebitda27": num(r[12]), "ll26": num(r[13]), "ll27": num(r[14]),
        })

    payload = {"fonte": "Research XP — Tabela de Múltiplos", "dataBase": data_base,
               "empresas": list(empresas.values())}
    SAIDA.write_text(
        "// Gerado por tools/xp_multiplos.py — não editar à mão.\n"
        "window.XP_DADOS = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(empresas)} empresas · data-base {data_base} → {SAIDA}")
    for r in ruins:
        print("Linha não reconhecida:", r)


if __name__ == "__main__":
    main()
