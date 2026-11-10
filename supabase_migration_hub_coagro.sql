-- ==============================================================================
-- HUB COAGRO v3.0 — SUPABASE / POSTGRESQL MIGRATION
-- Plataforma Central de Governança de Marca, Mídia & Criação
-- Grupo Coagro • Coagro Pet • RB Agrícola
-- ==============================================================================

-- Habilita extensões necessárias
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABELA DE UNIDADES / FILIAIS (stores)
-- ------------------------------------------------------------------------------
create table if not exists public.stores (
    id text primary key,
    nome text not null,
    bandeira text not null check (bandeira in ('COAGRO_AGRO', 'COAGRO_PET', 'RB_AGRICOLA')),
    cidade text not null,
    uf text not null,
    cnpj text not null,
    telefone text not null,
    telefone_formatado text not null,
    gerente_email text not null,
    created_at timestamptz not null default now()
);

comment on table public.stores is 'Diretório oficial das 16 unidades (Agro, Pet e RB Agrícola) do Grupo Coagro';

-- ------------------------------------------------------------------------------
-- 2. TABELA DE DEMANDAS DE MARKETING & CURADORIA (marketing_requests)
-- ------------------------------------------------------------------------------
create table if not exists public.marketing_requests (
    id text primary key,
    protocol_code text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    store_id text not null references public.stores(id) on update cascade,
    store_name text not null,
    requester_email text not null,
    module_type text not null,
    title text not null,
    subtitle_or_summary text not null,
    governance_track text not null check (governance_track in ('GREEN_DIRECT', 'YELLOW_CURATOR')),
    status text not null check (status in ('PENDING', 'APPROVED', 'REJECTED', 'QUOTING', 'NEEDS_REVISION', 'IN_REVISION')),
    guardrail_warnings text[] not null default array[]::text[],
    unknown_dictionary_terms text[] not null default array[]::text[],
    curator_notes text,
    approved_file_url text,
    payload_json jsonb not null default '{}'::jsonb
);

create index if not exists idx_marketing_requests_store on public.marketing_requests(store_id);
create index if not exists idx_marketing_requests_status on public.marketing_requests(status);
create index if not exists idx_marketing_requests_track on public.marketing_requests(governance_track);
create index if not exists idx_marketing_requests_created on public.marketing_requests(created_at desc);

comment on table public.marketing_requests is 'Fila de curadoria centralizada do Kaio (Via Verde direta vs. Via Amarela com revisão)';

-- ------------------------------------------------------------------------------
-- 3. TABELA DE DICIONÁRIO CORPORATIVO AGRO (agro_dictionary)
-- ------------------------------------------------------------------------------
create table if not exists public.agro_dictionary (
    id text primary key,
    canonical_term text not null unique,
    category text not null check (category in ('BRAND_PARTNER', 'COMMERCIAL_LINE', 'ACTIVE_INGREDIENT', 'CULTIVAR_REGIONAL')),
    aliases text[] not null default array[]::text[],
    added_by text not null default 'Curador (Kaio)',
    added_at timestamptz not null default now()
);

create index if not exists idx_agro_dict_term on public.agro_dictionary(canonical_term);
create index if not exists idx_agro_dict_cat on public.agro_dictionary(category);

comment on table public.agro_dictionary is 'Vocabulário técnico homologado pelo marketing para saneamento de títulos do ERP';

-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
alter table public.stores enable row level security;
alter table public.marketing_requests enable row level security;
alter table public.agro_dictionary enable row level security;

-- Políticas para 'stores' (leitura livre para balcão, gerentes e curadores)
create policy "stores_select_policy"
    on public.stores for select
    to anon, authenticated
    using (true);

-- Políticas para 'marketing_requests'
-- Leitura: todos podem ver os chamados da rede
create policy "marketing_requests_select_policy"
    on public.marketing_requests for select
    to anon, authenticated
    using (true);

-- Inserção: gerentes e operadores podem criar solicitações
create policy "marketing_requests_insert_policy"
    on public.marketing_requests for insert
    to anon, authenticated
    with check (true);

-- Atualização: curadores aprovam/rejeitam e gerentes podem atualizar rascunho
create policy "marketing_requests_update_policy"
    on public.marketing_requests for update
    to anon, authenticated
    using (true)
    with check (true);

-- Políticas para 'agro_dictionary'
-- Leitura: todos os módulos usam para spellcheck automático
create policy "agro_dictionary_select_policy"
    on public.agro_dictionary for select
    to anon, authenticated
    using (true);

-- Inserção/Atualização: curador homologa novas palavras técnicas
create policy "agro_dictionary_insert_policy"
    on public.agro_dictionary for insert
    to anon, authenticated
    with check (true);

create policy "agro_dictionary_update_policy"
    on public.agro_dictionary for update
    to anon, authenticated
    using (true)
    with check (true);

-- ------------------------------------------------------------------------------
-- 5. CARGA INICIAL (SEEDS OFICIAIS DO GRUPO COAGRO)
-- ------------------------------------------------------------------------------

-- Filiais Oficiais (16 Unidades)
insert into public.stores (id, nome, bandeira, cidade, uf, cnpj, telefone, telefone_formatado, gerente_email)
values
    ('matriz-adm', 'Matriz Administrativa Coagro', 'COAGRO_AGRO', 'Arapiraca', 'AL', '12.210.825/0001-35', '82988360271', '(82) 98836-0271', 'diretoria@grupocoagro.com.br'),
    ('cd-logistica', 'Centro de Distribuição Coagro', 'COAGRO_AGRO', 'Arapiraca', 'AL', '12.210.825/0001-35', '82988360271', '(82) 98836-0271', 'logistica@grupocoagro.com.br'),
    ('entrega-rapida', 'Coagro Entrega Rápida', 'COAGRO_AGRO', 'Arapiraca', 'AL', '12.210.825/0001-35', '82999810145', '(82) 99981-0145', 'entregas@grupocoagro.com.br'),
    ('catedral', 'Coagro Catedral (Arapiraca Centro)', 'COAGRO_AGRO', 'Arapiraca', 'AL', '12.210.825/0001-35', '82988360271', '(82) 98836-0271', 'gerente.catedral@grupocoagro.com.br'),
    ('fumal', 'Coagro Fumal (Arapiraca)', 'COAGRO_AGRO', 'Arapiraca', 'AL', '12.210.825/0004-88', '82999810056', '(82) 99981-0056', 'gerente.fumal@grupocoagro.com.br'),
    ('palmeira', 'Coagro Palmeira dos Índios', 'COAGRO_AGRO', 'Palmeira dos Índios', 'AL', '12.210.825/0002-16', '82999810098', '(82) 99981-0098', 'gerente.palmeira@grupocoagro.com.br'),
    ('santana', 'Coagro Santana do Ipanema', 'COAGRO_AGRO', 'Santana do Ipanema', 'AL', '12.210.825/0003-05', '82999810112', '(82) 99981-0112', 'gerente.santana@grupocoagro.com.br'),
    ('batalha', 'Coagro Batalha (Bacia Leiteira)', 'COAGRO_AGRO', 'Batalha', 'AL', '12.210.825/0005-69', '82999810123', '(82) 99981-0123', 'gerente.batalha@grupocoagro.com.br'),
    ('delmiro', 'Coagro Delmiro Gouveia (Sertão)', 'COAGRO_AGRO', 'Delmiro Gouveia', 'AL', '12.210.825/0006-40', '82999810134', '(82) 99981-0134', 'gerente.delmiro@grupocoagro.com.br'),
    ('penedo', 'Coagro Penedo (Baixo São Francisco)', 'COAGRO_AGRO', 'Penedo', 'AL', '12.210.825/0007-20', '82999810145', '(82) 99981-0145', 'gerente.penedo@grupocoagro.com.br'),
    ('uniaopalmares', 'Coagro União dos Palmares (Zona da Mata)', 'COAGRO_AGRO', 'União dos Palmares', 'AL', '12.210.825/0008-01', '82999810156', '(82) 99981-0156', 'gerente.palmares@grupocoagro.com.br'),
    ('aracaju', 'Coagro Aracaju (Matriz SE)', 'COAGRO_AGRO', 'Aracaju', 'SE', '12.210.825/0009-92', '79999810167', '(79) 99981-0167', 'gerente.aracaju@grupocoagro.com.br'),
    ('lagarto', 'Coagro Lagarto (Centro-Sul SE)', 'COAGRO_AGRO', 'Lagarto', 'SE', '12.210.825/0010-26', '79999810178', '(79) 99981-0178', 'gerente.lagarto@grupocoagro.com.br'),
    ('umbauba', 'Coagro Umbaúba (Sul Sergipano)', 'COAGRO_AGRO', 'Umbaúba', 'SE', '12.210.825/0011-07', '79999810189', '(79) 99981-0189', 'gerente.umbauba@grupocoagro.com.br'),
    ('pet-arapiraca', 'Coagro Pet Arapiraca (Boutique & Clínica)', 'COAGRO_PET', 'Arapiraca', 'AL', '12.210.825/0012-98', '82999810190', '(82) 99981-0190', 'gerente.pet@grupocoagro.com.br'),
    ('rb-agricola-ribeiropolis', 'RB Agrícola (Ribeirópolis SE)', 'RB_AGRICOLA', 'Ribeirópolis', 'SE', '12.210.825/0013-79', '79999810201', '(79) 99981-0201', 'gerente.rbagricola@grupocoagro.com.br')
on conflict (id) do update set
    nome = excluded.nome,
    bandeira = excluded.bandeira,
    cidade = excluded.cidade,
    uf = excluded.uf,
    cnpj = excluded.cnpj,
    telefone = excluded.telefone,
    telefone_formatado = excluded.telefone_formatado,
    gerente_email = excluded.gerente_email;

-- Dicionário Corporativo Agro (Termos Essenciais)
insert into public.agro_dictionary (id, canonical_term, category, aliases, added_by)
values
    ('dict-ourofino', 'Ourofino', 'BRAND_PARTNER', array['ouro fino', 'ourofino saude animal'], 'Marketing Coagro'),
    ('dict-tramontina', 'Tramontina', 'BRAND_PARTNER', array['travero', 'tramontina ferramentas'], 'Marketing Coagro'),
    ('dict-dectomax', 'Dectomax', 'COMMERCIAL_LINE', array['dectomax pfizer', 'dectomax zoetis'], 'Marketing Coagro'),
    ('dict-bovigold', 'Bovigold', 'COMMERCIAL_LINE', array['bovigold dsm', 'bovigold tortuga'], 'Marketing Coagro'),
    ('dict-tutticanis', 'Tutticanis', 'COMMERCIAL_LINE', array['tutticanis select', 'tuticanis'], 'Marketing Coagro'),
    ('dict-hexazinona', 'Hexazinona', 'ACTIVE_INGREDIENT', array['hexazinone', 'hexazinona sl'], 'Marketing Coagro'),
    ('dict-glifosato', 'Glifosato', 'ACTIVE_INGREDIENT', array['glyphosate', 'glifosato 480'], 'Marketing Coagro'),
    ('dict-mombaca', 'Mombaça', 'CULTIVAR_REGIONAL', array['mombaca', 'capim mombaça', 'panicum maximum mombaça'], 'Marketing Coagro'),
    ('dict-piata', 'Piatã', 'CULTIVAR_REGIONAL', array['piata', 'brachiaria brizantha piatã'], 'Marketing Coagro')
on conflict (canonical_term) do nothing;
