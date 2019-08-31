--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "entityId" integer,
    text text NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.comment OWNER TO root;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO root;

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: entity; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.entity (
    id integer NOT NULL,
    name text NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    website text DEFAULT ''::text NOT NULL,
    "numberOfCalls" integer DEFAULT 0 NOT NULL,
    "phoneNumbers" json DEFAULT '[]'::json,
    "emailAddress" json DEFAULT '[]'::json
);


ALTER TABLE public.entity OWNER TO root;

--
-- Name: entity_categories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.entity_categories (
    "entityId" integer NOT NULL,
    "entityCategoryId" integer NOT NULL
);


ALTER TABLE public.entity_categories OWNER TO root;

--
-- Name: entity_category; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.entity_category (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.entity_category OWNER TO root;

--
-- Name: entity_category_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.entity_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entity_category_id_seq OWNER TO root;

--
-- Name: entity_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.entity_category_id_seq OWNED BY public.entity_category.id;


--
-- Name: entity_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entity_id_seq OWNER TO root;

--
-- Name: entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.entity_id_seq OWNED BY public.entity.id;


--
-- Name: meeting; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.meeting (
    id integer NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    tags text[] NOT NULL,
    "facilitatorId" integer NOT NULL
);


ALTER TABLE public.meeting OWNER TO root;

--
-- Name: meeting_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.meeting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meeting_id_seq OWNER TO root;

--
-- Name: meeting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.meeting_id_seq OWNED BY public.meeting.id;


--
-- Name: meeting_participant; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.meeting_participant (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "meetingId" integer NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.meeting_participant OWNER TO root;

--
-- Name: meeting_participant_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.meeting_participant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meeting_participant_id_seq OWNER TO root;

--
-- Name: meeting_participant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.meeting_participant_id_seq OWNED BY public.meeting_participant.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    status text,
    phone text,
    photo text,
    "birthDate" text,
    "joinDate" text,
    generation text,
    role text DEFAULT 'user'::text NOT NULL
);


ALTER TABLE public."user" OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: entity id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity ALTER COLUMN id SET DEFAULT nextval('public.entity_id_seq'::regclass);


--
-- Name: entity_category id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity_category ALTER COLUMN id SET DEFAULT nextval('public.entity_category_id_seq'::regclass);


--
-- Name: meeting id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting ALTER COLUMN id SET DEFAULT nextval('public.meeting_id_seq'::regclass);


--
-- Name: meeting_participant id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting_participant ALTER COLUMN id SET DEFAULT nextval('public.meeting_participant_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- Data for Name: entity; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.entity (id, name, city, address, website, "numberOfCalls", "phoneNumbers", "emailAddress") VALUES (1, 'Andos', 'Brasov', '', 'www.test.test', 0, '[{"phone":"1234567890","info":"Info"}]', '[]');


--
-- Data for Name: entity_categories; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.entity_categories ("entityId", "entityCategoryId") VALUES (1, 1);


--
-- Data for Name: entity_category; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.entity_category (id, name) VALUES (1, 'Food');


--
-- Data for Name: meeting; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.meeting (id, name, date, tags, "facilitatorId") VALUES (3, 'SG', '2019-08-30', '{}', 1);


--
-- Data for Name: meeting_participant; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.meeting_participant (id, "userId", "meetingId", confirmed) VALUES (2, 1, 3, true);


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."user" (id, email, name, status, phone, photo, "birthDate", "joinDate", generation, role) VALUES (1, 'test@test.ro', 'Andrei', NULL, NULL, NULL, NULL, NULL, NULL, 'user');


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comment_id_seq', 1, false);


--
-- Name: entity_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.entity_category_id_seq', 1, true);


--
-- Name: entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.entity_id_seq', 1, true);


--
-- Name: meeting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.meeting_id_seq', 3, true);


--
-- Name: meeting_participant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.meeting_participant_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.user_id_seq', 1, true);


--
-- Name: meeting_participant PK_076322be51eef11585f17a45c66; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting_participant
    ADD CONSTRAINT "PK_076322be51eef11585f17a45c66" PRIMARY KEY (id);


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- Name: entity PK_50a7741b415bc585fcf9c984332; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity
    ADD CONSTRAINT "PK_50a7741b415bc585fcf9c984332" PRIMARY KEY (id);


--
-- Name: entity_category PK_b3d2659d19dc95f0ae40d5f4c24; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity_category
    ADD CONSTRAINT "PK_b3d2659d19dc95f0ae40d5f4c24" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: entity_categories PK_d6b189135304f2a5149120fab9c; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity_categories
    ADD CONSTRAINT "PK_d6b189135304f2a5149120fab9c" PRIMARY KEY ("entityId", "entityCategoryId");


--
-- Name: meeting PK_dccaf9e4c0e39067d82ccc7bb83; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting
    ADD CONSTRAINT "PK_dccaf9e4c0e39067d82ccc7bb83" PRIMARY KEY (id);


--
-- Name: meeting REL_72fd9aa855f2378119aea5d8e2; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting
    ADD CONSTRAINT "REL_72fd9aa855f2378119aea5d8e2" UNIQUE ("facilitatorId");


--
-- Name: meeting_participant REL_f50b1fcc294264a173349a75a8; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting_participant
    ADD CONSTRAINT "REL_f50b1fcc294264a173349a75a8" UNIQUE ("userId");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_60fc469a3af6c3b6acbddf9ed0; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_60fc469a3af6c3b6acbddf9ed0" ON public.entity_categories USING btree ("entityId");


--
-- Name: IDX_bd18b5dbaf7dcaae7284ad9ef5; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_bd18b5dbaf7dcaae7284ad9ef5" ON public.entity_categories USING btree ("entityCategoryId");


--
-- Name: comment FK_2950cfa146fc50334efa61a70b5; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_2950cfa146fc50334efa61a70b5" FOREIGN KEY ("entityId") REFERENCES public.entity(id) ON DELETE CASCADE;


--
-- Name: entity_categories FK_60fc469a3af6c3b6acbddf9ed06; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity_categories
    ADD CONSTRAINT "FK_60fc469a3af6c3b6acbddf9ed06" FOREIGN KEY ("entityId") REFERENCES public.entity(id) ON DELETE CASCADE;


--
-- Name: meeting_participant FK_72b595bfd7e389da4b639fee743; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting_participant
    ADD CONSTRAINT "FK_72b595bfd7e389da4b639fee743" FOREIGN KEY ("meetingId") REFERENCES public.meeting(id) ON DELETE CASCADE;


--
-- Name: meeting FK_72fd9aa855f2378119aea5d8e24; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting
    ADD CONSTRAINT "FK_72fd9aa855f2378119aea5d8e24" FOREIGN KEY ("facilitatorId") REFERENCES public."user"(id);


--
-- Name: entity_categories FK_bd18b5dbaf7dcaae7284ad9ef52; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.entity_categories
    ADD CONSTRAINT "FK_bd18b5dbaf7dcaae7284ad9ef52" FOREIGN KEY ("entityCategoryId") REFERENCES public.entity_category(id) ON DELETE CASCADE;


--
-- Name: comment FK_c0354a9a009d3bb45a08655ce3b; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: meeting_participant FK_f50b1fcc294264a173349a75a8c; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.meeting_participant
    ADD CONSTRAINT "FK_f50b1fcc294264a173349a75a8c" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

