// src/ui/BrandHubView.tsx
// Módulo 4 & Seção 7 da Especificação: Kit Corporativo de Colaboradores, Papelaria A4, Vetores SVG & Diretório de Lojas

import React, { useState, useRef } from 'react';
import { useStudioStore, studioActions } from '../core/store';
import {
  COAGRO_STORES,
  COAGRO_CORPORATE_INFO,
  getCoagroStoreById,
  type CoagroStore,
} from '../core/coagroStores';
import {
  LogoHorizontalAzul,
  LogoHorizontalBranca,
  CoagroPetLogo,
  CoagroSimboloCasinha,
} from './coagroLogos';
import { exportElementToPng, printOrSaveA4Sheet } from '../engine/exporter';
import { DEFAULT_ERP_CATALOG_DB, formatBRL } from '../core/businessRules';
import type { ErpCatalogRecord, RegulatoryCategory } from '../core/types';

export type BrandHubTab = 'team' | 'documents' | 'assets' | 'directory' | 'campaigns';

export const BrandHubView: React.FC = () => {
  const state = useStudioStore();
  const activeStore = getCoagroStoreById(state.activeStoreId);
  const isPet =
    state.brandKit.activeDepartmentId === 'dept-2' ||
    activeStore.bandeira === 'COAGRO_PET';

  const [activeTab, setActiveTab] = useState<BrandHubTab>('team');
  const [notice, setNotice] = useState<string | null>(null);

  // Kit Colaborador (Assinatura, Cartão de Visita e Avatar WhatsApp)
  const [collabName, setCollabName] = useState('Kaio Virgínio');
  const [collabRole, setCollabRole] = useState('Gestor de Foco & Marketing');
  const [collabPhone, setCollabPhone] = useState(activeStore.telefoneFormatado);
  const [collabEmail, setCollabEmail] = useState(activeStore.gerenteEmail);
  const [collabPhoto, setCollabPhoto] = useState<string | null>(null);

  // Papel Timbrado A4
  const [docTitle, setDocTitle] = useState('COMUNICADO OFICIAL DE FILIAL');
  const [docRecipient, setDocRecipient] = useState(
    'Aos Clientes, Produtores Rurais e Parceiros Comerciais'
  );
  const [docBody, setDocBody] = useState(
    'Informamos que, devido ao período de safra e alta demanda de plantio na região, nossa equipe técnica e atendimento de balcão estarão operando em regime especial.\n\nPara cotações diretas de defensivos, sementes, irrigação e nutrição animal, entre em contato diretamente pelo WhatsApp oficial informado no rodapé deste documento.'
  );
  const [docSigner, setDocSigner] = useState(`Gerência • ${activeStore.nome}`);

  // Filtro Diretório de Filiais
  const [storeSearch, setStoreSearch] = useState('');
  const [ufFilter, setUfFilter] = useState<'ALL' | 'AL' | 'SE' | 'BA'>('ALL');
  const [catalogSearch, setCatalogSearch] = useState('');

  const signatureRef = useRef<HTMLDivElement>(null);
  const businessCardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const letterheadRef = useRef<HTMLDivElement>(null);

  const flashNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCollabPhoto(reader.result as string);
      flashNotice('✅ Foto do colaborador aplicada na Assinatura, Cartão e Avatar!');
    };
    reader.readAsDataURL(file);
  };

  // Cadastro de Novo Produto Homologado com Foto (Curador Admin)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPriceTo, setNewPriceTo] = useState('');
  const [newPriceFrom, setNewPriceFrom] = useState('');
  const [newUnit, setNewUnit] = useState('L');
  const [newCategory, setNewCategory] = useState<RegulatoryCategory>('STANDARD');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);

  const handleProductPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewProductImage(reader.result as string);
      flashNotice('📸 Imagem do produto carregada para homologação!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.trim() || !newTitle.trim() || !newPriceTo.trim()) {
      flashNotice('⚠️ Preencha SKU, Nome do Produto e Preço de Venda.');
      return;
    }
    const priceToNum = parseFloat(newPriceTo.replace(',', '.'));
    if (isNaN(priceToNum) || priceToNum <= 0) {
      flashNotice('⚠️ Preço de venda inválido.');
      return;
    }
    const priceFromNum = newPriceFrom ? parseFloat(newPriceFrom.replace(',', '.')) : undefined;

    const record: ErpCatalogRecord = {
      skuCode: newSku.trim().toUpperCase(),
      rawTitle: newTitle.trim(),
      cleanedTitle: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      unit: newUnit.trim() || 'un',
      priceFrom: !isNaN(priceFromNum || NaN) ? priceFromNum : undefined,
      priceTo: priceToNum,
      regulatoryCategory: newCategory,
      productImageUrl: newProductImage || undefined,
      updatedAtISO: new Date().toISOString(),
    };

    studioActions.addCustomCatalogProduct(record);
    flashNotice(`⭐ Produto SKU ${record.skuCode} homologado com sucesso na Media Library!`);
    setNewSku('');
    setNewTitle('');
    setNewSubtitle('');
    setNewPriceTo('');
    setNewPriceFrom('');
    setNewProductImage(null);
    setShowAddProductModal(false);
  };

  const handleCopySignatureHtml = async () => {
    const html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Inter',Arial,sans-serif;color:#1f2937;font-size:13px;line-height:1.45;border-collapse:collapse;">
      <tr>
        <td style="padding-right:16px;border-right:3px solid ${isPet ? '#001C71' : '#004d40'};vertical-align:middle;text-align:center;">
          <div style="font-size:20px;font-weight:900;color:${isPet ? '#001C71' : '#004d40'};font-family:'Exo 2',Arial,sans-serif;">COAGRO</div>
          <div style="font-size:9px;color:#ffab00;font-weight:bold;text-transform:uppercase;">${isPet ? 'Coagro Pet' : 'Grupo Coagro'}</div>
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <div style="font-size:15px;font-weight:bold;color:#111827;">${collabName}</div>
          <div style="font-size:12px;color:${isPet ? '#001C71' : '#004d40'};font-weight:bold;margin-bottom:4px;">${collabRole} • ${activeStore.nome}</div>
          <div style="font-size:11px;color:#4b5563;">WhatsApp: <strong>${collabPhone}</strong> • E-mail: <strong>${collabEmail}</strong></div>
          <div style="font-size:10px;color:#6b7280;margin-top:2px;">${activeStore.endereco} - ${activeStore.cidade}/${activeStore.estado} • ${COAGRO_CORPORATE_INFO.website}</div>
        </td>
      </tr>
    </table>`;
    try {
      await navigator.clipboard.writeText(html);
      flashNotice('✅ Código HTML da Assinatura copiado para o Outlook/Webmail!');
    } catch {
      flashNotice('⚠️ Não foi possível copiar automaticamente.');
    }
  };

  const handleRequestPrintedCard = () => {
    const req = studioActions.submitMarketingRequest(
      `Solicitação de Cartão de Visita Impresso: ${collabName} (${collabRole}) — ${activeStore.nome} • Tel: ${collabPhone} • E-mail: ${collabEmail}`
    );
    flashNotice(
      `📨 Pedido ${req.protocolCode} enviado para a Fila do Curador para cotação gráfica!`
    );
  };

  const handleCopyStoreData = (store: CoagroStore) => {
    const text = `UNIDADE: ${store.nome}\nRAZÃO SOCIAL: ${store.razaoSocial}\nCNPJ: ${store.cnpj}\nENDEREÇO: ${store.endereco} - ${store.cidade}/${store.estado} (CEP: ${store.cep})\nWHATSAPP: ${store.telefoneFormatado}`;
    navigator.clipboard.writeText(text);
    flashNotice(`✅ Dados fiscais de ${store.nome} copiados!`);
  };

  const filteredStores = COAGRO_STORES.filter((s) => {
    const matchUf = ufFilter === 'ALL' || s.estado === ufFilter;
    const q = storeSearch.toLowerCase();
    const matchText =
      !q ||
      s.nome.toLowerCase().includes(q) ||
      s.cidade.toLowerCase().includes(q) ||
      s.cnpj.includes(q);
    return matchUf && matchText;
  });

  const agroColors = [
    { name: 'Verde Safra (Primária Agro)', hex: '#004d40', use: 'Fundos institucionais Agro, cabeçalhos e botões' },
    { name: 'Ouro Safra (Destaque / Acento)', hex: '#ffab00', use: 'Telhado da casinha, preços e selos de campanha' },
    { name: 'Azul Titular Coagro', hex: '#001C71', use: 'Logotipo oficial COAGRO e contraste executivo' },
    { name: 'Azul Celeste (Apoio / Pet)', hex: '#4897D0', use: 'Identidade Coagro Pet e tags técnicas' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {notice && (
        <div className="p-3.5 rounded-2xl bg-[#004d40] text-white text-xs font-bold flex items-center justify-between shadow-md">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-[#ffab00] font-black ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cabeçalho e Abas do Brand Hub */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#004d40] text-[#ffab00]">
            Brand Hub &amp; Kit Corporativo • {activeStore.nome}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Central de Padronização Institucional ({isPet ? 'Coagro Pet' : 'Grupo Coagro'})
          </h1>
          <p className="text-xs text-slate-500">
            Assinaturas de e-mail, cartões de visita, avatar de WhatsApp, papel timbrado A4, vetores e diretório das 15 unidades.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {(
            [
              { id: 'team', label: '🪪 Kit Colaborador' },
              { id: 'documents', label: '📄 Papel Timbrado A4' },
              { id: 'assets', label: '🎨 Logos & Paleta Oficial' },
              { id: 'directory', label: '🏬 15 Unidades & CNPJs' },
              { id: 'campaigns', label: '📦 Campanhas & Media Library' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#004d40] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ABA 1: KIT CORPORATIVO DE COLABORADORES */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário Guiado */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 border-b border-slate-100 pb-2.5">
              1. Dados do Colaborador
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Unidade / Filial Vinculada
                </label>
                <select
                  value={state.activeStoreId}
                  onChange={(e) => {
                    studioActions.setActiveStore(e.target.value);
                    const st = getCoagroStoreById(e.target.value);
                    setCollabPhone(st.telefoneFormatado);
                    setCollabEmail(st.gerenteEmail);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900"
                >
                  {COAGRO_STORES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.nome} ({st.cidade}/{st.estado})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={collabName}
                  onChange={(e) => setCollabName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Cargo / Função Oficial
                </label>
                <input
                  type="text"
                  value={collabRole}
                  onChange={(e) => setCollabRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                    WhatsApp Comercial
                  </label>
                  <input
                    type="text"
                    value={collabPhone}
                    onChange={(e) => setCollabPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="text"
                    value={collabEmail}
                    onChange={(e) => setCollabEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Foto do Colaborador (Opcional — Sincroniza Avatar e Assinatura)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#004d40] file:text-white cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Prévias Travadas: Assinatura, Cartão de Visita e Avatar */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Assinatura de E-mail */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-800">
                  Prévia 1: Assinatura de E-mail Oficial (Via Verde — Autoatendimento)
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopySignatureHtml}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black cursor-pointer"
                  >
                    📋 Copiar HTML
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      exportElementToPng(
                        signatureRef.current,
                        `assinatura-${collabName.toLowerCase().replace(/\s+/g, '-')}.png`,
                        900
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#004d40] text-[#ffab00] text-xs font-black cursor-pointer"
                  >
                    ⬇️ Baixar PNG
                  </button>
                </div>
              </div>

              <div
                ref={signatureRef}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-4"
              >
                {collabPhoto ? (
                  <img
                    src={collabPhoto}
                    alt={collabName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#004d40] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 p-2">
                    <CoagroSimboloCasinha className="w-10 h-10" />
                  </div>
                )}

                <div className="pr-4 border-r-2 border-[#004d40] shrink-0">
                  {isPet ? (
                    <CoagroPetLogo className="h-9 w-auto" />
                  ) : (
                    <LogoHorizontalAzul className="h-8 w-auto" />
                  )}
                </div>

                <div className="space-y-0.5 text-xs">
                  <div className="text-sm font-black text-slate-900">{collabName}</div>
                  <div className="font-bold text-[#004d40]">
                    {collabRole} • {activeStore.nome}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    WhatsApp: <strong>{collabPhone}</strong> • {collabEmail}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeStore.endereco} - {activeStore.cidade}/{activeStore.estado}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Cartão de Visita Oficial + Avatar de WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Cartão de Visita (9x5cm proporcional) */}
              <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-800">
                    Prévia 2: Cartão de Visita (9×5cm)
                  </h3>
                  <button
                    type="button"
                    onClick={handleRequestPrintedCard}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-black cursor-pointer"
                  >
                    📨 Solicitar Impressão Gráfica
                  </button>
                </div>

                <div
                  ref={businessCardRef}
                  className="aspect-[1.75/1] w-full rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-md"
                  style={{
                    background: isPet
                      ? 'linear-gradient(135deg, #001C71 0%, #0b2e99 100%)'
                      : 'linear-gradient(135deg, #004d40 0%, #002b24 100%)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <LogoHorizontalBranca className="h-7 w-auto" />
                    <span className="px-2 py-0.5 rounded bg-[#ffab00] text-slate-950 text-[9px] font-black uppercase">
                      {activeStore.cidade}/{activeStore.estado}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-base font-black tracking-tight text-white">
                      {collabName}
                    </div>
                    <div className="text-xs font-bold text-[#ffab00]">{collabRole}</div>
                    <div className="text-[11px] text-white/90 pt-1">
                      📱 {collabPhone} • ✉️ {collabEmail}
                    </div>
                    <div className="text-[10px] text-white/70">
                      📍 {activeStore.endereco} • {activeStore.nome}
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar WhatsApp Corporativo */}
              <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-800">
                    Prévia 3: Avatar Zap
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      exportElementToPng(
                        avatarRef.current,
                        `avatar-whatsapp-${activeStore.id}.png`,
                        600
                      )
                    }
                    className="px-2.5 py-1 rounded-xl bg-[#004d40] text-[#ffab00] text-[11px] font-black cursor-pointer"
                  >
                    ⬇️ PNG
                  </button>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div
                    ref={avatarRef}
                    className="w-36 h-36 rounded-3xl flex flex-col items-center justify-between p-3 text-center text-white relative overflow-hidden shadow-md"
                    style={{
                      background: isPet ? '#001C71' : '#004d40',
                      border: '4px solid #ffab00',
                    }}
                  >
                    <CoagroSimboloCasinha className="w-11 h-11 mt-1" />
                    <div>
                      <div className="text-xs font-black uppercase leading-tight">
                        {collabName.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div className="text-[9px] font-bold text-[#ffab00] uppercase mt-0.5">
                        {activeStore.nome}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PAPEL TIMBRADO A4 OFICIAL */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-900">
              Papel Timbrado &amp; Ofícios A4 ({activeStore.nome})
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Título do Documento
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Destinatário / Vocativo
                </label>
                <input
                  type="text"
                  value={docRecipient}
                  onChange={(e) => setDocRecipient(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Corpo do Comunicado / Ofício
                </label>
                <textarea
                  rows={5}
                  value={docBody}
                  onChange={(e) => setDocBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Assinatura Responsável
                </label>
                <input
                  type="text"
                  value={docSigner}
                  onChange={(e) => setDocSigner(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    printOrSaveA4Sheet(
                      letterheadRef.current,
                      `Papel_Timbrado_${activeStore.id}`
                    )
                  }
                  className="flex-1 py-2.5 rounded-xl bg-[#004d40] text-[#ffab00] text-xs font-black uppercase cursor-pointer"
                >
                  🖨️ Imprimir / Salvar PDF A4
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={letterheadRef}
              className="w-full max-w-[520px] aspect-[210/297] bg-white rounded-2xl border border-slate-300 shadow-md p-8 flex flex-col justify-between text-slate-800"
            >
              {/* Cabeçalho Timbrado */}
              <div className="flex items-center justify-between border-b-2 border-[#004d40] pb-4">
                <LogoHorizontalAzul className="h-10 w-auto" />
                <div className="text-right text-[10px] text-slate-500">
                  <div className="font-black text-slate-800 uppercase">{activeStore.nome}</div>
                  <div>CNPJ: {activeStore.cnpj}</div>
                  <div>{activeStore.cidade} - {activeStore.estado}</div>
                </div>
              </div>

              {/* Corpo */}
              <div className="my-auto py-6 space-y-4">
                <div className="text-xs text-slate-400">
                  {activeStore.cidade}/{activeStore.estado}, {new Date().toLocaleDateString('pt-BR')}
                </div>
                <h3 className="text-base font-black text-[#004d40] uppercase">{docTitle}</h3>
                <div className="text-xs font-bold text-slate-700">{docRecipient},</div>
                <p className="text-xs leading-relaxed whitespace-pre-line text-slate-700">
                  {docBody}
                </p>
                <div className="pt-8">
                  <div className="w-48 border-t border-slate-400 pt-1.5 text-xs font-black text-slate-900">
                    {docSigner}
                  </div>
                  <div className="text-[10px] text-slate-500">{activeStore.razaoSocial}</div>
                </div>
              </div>

              {/* Rodapé Oficial */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[9px] text-slate-500">
                <span>
                  {activeStore.endereco} • CEP {activeStore.cep} • {activeStore.cidade}/{activeStore.estado}
                </span>
                <span className="font-bold text-[#004d40]">
                  WhatsApp: {activeStore.telefoneFormatado} • {COAGRO_CORPORATE_INFO.website}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: LOGOS VETORIAIS & PALETA TRAVADA */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div className="h-28 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                <LogoHorizontalAzul className="max-h-14 w-auto" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-black uppercase text-slate-900">
                  Logo Horizontal Oficial (Fundo Claro)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uso padrão em documentos A4, cabeçalhos e fundos brancos.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div className="h-28 rounded-xl bg-[#004d40] flex items-center justify-center p-4">
                <LogoHorizontalBranca className="max-h-14 w-auto" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-black uppercase text-slate-900">
                  Logo Horizontal Branca (Fundo Verde/Azul)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uso obrigatório sobre fundos escuros institucionais (#004d40 e #001C71).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div className="h-28 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                <CoagroSimboloCasinha className="w-16 h-16" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-black uppercase text-slate-900">
                  Símbolo Casinha Coagro (Ícone / Avatar)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Favicon, selo de perfil de WhatsApp e marca d&apos;água oficial.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <h3 className="text-xs font-black uppercase text-slate-900 mb-3">
              Paleta Institucional Travada (Proibido Misturar Agro com Pet)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {agroColors.map((c) => (
                <div
                  key={c.hex}
                  className="p-3.5 rounded-xl border border-slate-200 space-y-2"
                >
                  <div
                    className="h-12 rounded-lg border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="text-xs font-black text-slate-900">{c.name}</div>
                  <div className="font-mono text-xs font-bold text-[#004d40]">{c.hex}</div>
                  <p className="text-[11px] text-slate-500">{c.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: DIRETÓRIO DAS 15 UNIDADES & CNPJS */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              placeholder="Buscar filial por cidade, nome ou CNPJ..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold"
            />
            <div className="flex gap-1.5">
              {(['ALL', 'AL', 'SE', 'BA'] as const).map((uf) => (
                <button
                  key={uf}
                  type="button"
                  onClick={() => setUfFilter(uf)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    ufFilter === uf
                      ? 'bg-[#004d40] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {uf === 'ALL' ? 'Todos (AL/SE/BA)' : uf}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((st) => (
              <div
                key={st.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-900">
                      {st.nome}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                      {st.cidade}/{st.estado}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">CNPJ: {st.cnpj}</div>
                  <div className="text-[11px] text-slate-600">{st.endereco}</div>
                  <div className="text-[11px] font-bold text-[#004d40]">
                    📱 {st.telefoneFormatado} • {st.gerenteEmail}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopyStoreData(st)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black cursor-pointer"
                  >
                    📋 Copiar CNPJ/Endereço
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      studioActions.setActiveStore(st.id);
                      flashNotice(`🏬 Filial ativa alterada para ${st.nome}!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#004d40] text-[#ffab00] text-[11px] font-black cursor-pointer"
                  >
                    Ativar Loja
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* 5. ABA: CAMPANHAS GLOBAIS DA REDE & MEDIA LIBRARY OFICIAL (SPRINT 3) */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campanhas Oficiais */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  🎯 Pacotes Comerciais &amp; Campanhas Sazonais Homologadas
                </h2>
                <p className="text-xs text-slate-500">
                  Padrões corporativos do Grupo Coagro para ações de safra, saldões e finais de semana. Ao aplicar, as cores e o selo são injetados automaticamente no estúdio com os dados da filial ativa ({activeStore.nome}).
                </p>
              </div>
              {state.brandKit.activeCampaignId && (
                <button
                  type="button"
                  onClick={() => {
                    studioActions.setActiveCampaign(null);
                    flashNotice('🔄 Campanha sazonal desativada. Retornado ao tema padrão da filial.');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition shrink-0"
                >
                  ✕ Desativar Campanha Ativa
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.brandKit.seasonalCampaigns.map((camp) => {
                const isActive = state.brandKit.activeCampaignId === camp.id;
                return (
                  <div
                    key={camp.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition ${
                      isActive
                        ? 'border-[#ffab00] bg-amber-50/40 ring-2 ring-[#ffab00]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-xs"
                          style={{
                            backgroundColor: camp.primaryColorHex,
                            color: camp.accentColorHex,
                            border: `1px solid ${camp.accentColorHex}40`,
                          }}
                        >
                          {camp.badgeText}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md bg-[#004d40] text-[#ffab00] text-[10px] font-black uppercase">
                            Ativa no Estúdio
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900">{camp.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Paleta homologada: <span className="font-mono text-[11px] font-bold" style={{ color: camp.primaryColorHex }}>{camp.primaryColorHex}</span> / <span className="font-mono text-[11px] font-bold" style={{ color: camp.accentColorHex }}>{camp.accentColorHex}</span>
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                        <div>🔒 <strong>Governança:</strong> Tipografia Exo 2 / Inter travada</div>
                        <div>🏬 <strong>Filial:</strong> {activeStore.nome} (WhatsApp {activeStore.telefoneFormatado})</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          studioActions.applyCampaignToStudio(camp.id, 'STORE_POSTER');
                          flashNotice(`⚡ Campanha "${camp.name}" aplicada no Módulo de Cartazes PDV!`);
                        }}
                        className="py-2 px-2.5 rounded-xl bg-[#004d40] hover:bg-[#00382e] text-[#ffab00] text-[11px] font-black cursor-pointer text-center transition"
                      >
                        ⚡ Cartaz PDV
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          studioActions.applyCampaignToStudio(camp.id, 'SOCIAL_MEDIA');
                          flashNotice(`📱 Campanha "${camp.name}" aplicada no Módulo de Redes Sociais!`);
                        }}
                        className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-black cursor-pointer text-center transition"
                      >
                        📱 WhatsApp / Feed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Galeria de Produtos Homologados (Media Library Coagro) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    📦 Galeria de Produtos Homologados (Media &amp; Catálogo Coagro)
                  </h2>
                  {state.userRole === 'CURATOR_ADMIN' && (
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(!showAddProductModal)}
                      className="px-3 py-1 rounded-xl bg-[#004d40] hover:bg-[#00382e] text-[#ffab00] text-xs font-black cursor-pointer transition shadow-2xs"
                    >
                      {showAddProductModal ? '✕ Fechar Cadastro' : '➕ Homologar Produto'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seleção rápida de SKUs homologados com fotos, títulos saneados e regras tributárias/MAPA validadas. Clique para carregar direto no estúdio.
                </p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="🔍 Buscar produto por SKU ou nome..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold focus:bg-white focus:border-[#004d40] outline-hidden"
                />
              </div>
            </div>

            {/* Formulário de Cadastro Rápido do Curador Admin (Sprint 8) */}
            {state.userRole === 'CURATOR_ADMIN' && showAddProductModal && (
              <form
                onSubmit={handleSaveCustomProduct}
                className="bg-amber-50/60 border border-amber-300 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    ✨ Cadastrar Novo Produto Homologado com Foto PNG
                  </h3>
                  <span className="text-[11px] font-bold text-amber-900">
                    Exclusivo Curador (Kaio) • Disponível imediatamente para todas as 15 filiais
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Código / SKU *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 80992"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Nome Comercial Limpo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Herbicida Sanson 40 SC FMC"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Categoria Regulatória
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as RegulatoryCategory)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    >
                      <option value="STANDARD">Agro &amp; Pet Geral</option>
                      <option value="AGRO_PESTICIDE">Agrotóxico / Defensivo (MAPA)</option>
                      <option value="VET_PRESCRIPTION">Medicamento Veterinário</option>
                      <option value="RESTRICTED_CHEMICAL">Químico Restrito</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Preço Normal (De R$)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 145,00"
                      value={newPriceFrom}
                      onChange={(e) => setNewPriceFrom(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Preço Oferta (Por R$) *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 119,90"
                      value={newPriceTo}
                      onChange={(e) => setNewPriceTo(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Unidade de Medida
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: L, kg, sc 25kg, un"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                      Subtítulo / Princípio Ativo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Nicosulfuron 40 g/L"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold outline-hidden focus:border-[#004d40]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-200">
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                      📷 Carregar Foto PNG (Fundo Transparente)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {newProductImage && (
                      <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                        ✓ Imagem selecionada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black cursor-pointer transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#004d40] hover:bg-[#00382e] text-[#ffab00] text-xs font-black cursor-pointer transition shadow-2xs"
                    >
                      💾 Homologar no Catálogo
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ...state.customCatalogDb,
                ...DEFAULT_ERP_CATALOG_DB.filter(
                  (def) =>
                    !state.customCatalogDb.some(
                      (c) => c.skuCode.toLowerCase() === def.skuCode.toLowerCase()
                    )
                ),
              ].filter((item) => {
                if (!catalogSearch.trim()) return true;
                const q = catalogSearch.toLowerCase();
                return (
                  item.skuCode.toLowerCase().includes(q) ||
                  item.cleanedTitle.toLowerCase().includes(q) ||
                  item.rawTitle.toLowerCase().includes(q) ||
                  (item.subtitle && item.subtitle.toLowerCase().includes(q))
                );
              }).map((item) => {
                const isCustom = state.customCatalogDb.some(
                  (c) => c.skuCode.toLowerCase() === item.skuCode.toLowerCase()
                );
                return (
                  <div
                    key={item.skuCode}
                    className="rounded-2xl p-4 border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">
                            SKU {item.skuCode}
                          </span>
                          {isCustom && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">
                              ⭐ Curadoria
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                          {item.regulatoryCategory === 'AGRO_PESTICIDE'
                            ? '⚠️ Agrotóxico (MAPA)'
                            : item.regulatoryCategory === 'VET_PRESCRIPTION'
                              ? '🩺 Veterinário'
                              : 'Agro & Pet Geral'}
                        </span>
                      </div>

                      {item.productImageUrl && (
                        <div className="w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                          <img
                            src={item.productImageUrl}
                            alt={item.cleanedTitle}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-snug">
                          {item.cleanedTitle}
                        </h4>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 pt-1">
                        {item.priceFrom && (
                          <span className="text-[11px] text-slate-400 line-through">
                            R$ {formatBRL(item.priceFrom)}
                          </span>
                        )}
                        <span className="text-base font-black text-[#004d40]">
                          R$ {formatBRL(item.priceTo)}
                          <span className="text-xs text-slate-500 font-semibold">/{item.unit}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        studioActions.applyCatalogRecord(item);
                        studioActions.setActiveModule('STORE_POSTER');
                        flashNotice(`✅ SKU ${item.skuCode} (${item.cleanedTitle}) carregado no Estúdio de Cartazes!`);
                      }}
                      className="w-full py-2 rounded-xl bg-[#004d40] hover:bg-[#00382e] text-[#ffab00] text-xs font-black cursor-pointer transition shadow-2xs"
                    >
                      ⚡ Carregar no Estúdio
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
