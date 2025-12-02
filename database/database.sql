--
-- PostgreSQL database dump
--

\restrict ehVdUHzfCsW1AVR5JjEgSBln8hs89gJ7ZRgr9yOyHci1aKYpUA69lQe2QfNY0Tr

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-01 20:52:01 MST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: shubham_k
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO shubham_k;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16676)
-- Name: Album; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Album" (
    al_albumid integer NOT NULL,
    al_artistid integer NOT NULL,
    al_title character varying(200) NOT NULL,
    al_release_date date,
    al_album_art text DEFAULT 'default.png'::text,
    CONSTRAINT "Album_al_release_date_check" CHECK ((al_release_date <= CURRENT_DATE)),
    CONSTRAINT check_album_release_date CHECK ((al_release_date <= CURRENT_DATE))
);


ALTER TABLE public."Album" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16675)
-- Name: Album_al_albumid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Album_al_albumid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Album_al_albumid_seq" OWNER TO postgres;

--
-- TOC entry 3769 (class 0 OID 0)
-- Dependencies: 214
-- Name: Album_al_albumid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Album_al_albumid_seq" OWNED BY public."Album".al_albumid;


--
-- TOC entry 213 (class 1259 OID 16666)
-- Name: Artist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Artist" (
    ar_artistid integer NOT NULL,
    ar_artistname character varying(100),
    ar_biography text,
    ar_country character varying(100),
    ar_birth_year integer,
    ar_death_year integer,
    CONSTRAINT "Artist_check" CHECK (((ar_death_year IS NULL) OR (ar_death_year >= ar_birth_year))),
    CONSTRAINT check_death_year CHECK (((ar_death_year IS NULL) OR (ar_death_year >= ar_birth_year)))
);


ALTER TABLE public."Artist" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16665)
-- Name: Artist_ar_artistid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Artist_ar_artistid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Artist_ar_artistid_seq" OWNER TO postgres;

--
-- TOC entry 3770 (class 0 OID 0)
-- Dependencies: 212
-- Name: Artist_ar_artistid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Artist_ar_artistid_seq" OWNED BY public."Artist".ar_artistid;


--
-- TOC entry 211 (class 1259 OID 16655)
-- Name: Library; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Library" (
    u_uid integer NOT NULL
);


ALTER TABLE public."Library" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16692)
-- Name: Playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Playlist" (
    p_pid integer NOT NULL,
    p_uid integer NOT NULL,
    p_title character varying(200) NOT NULL,
    p_description text,
    p_creation_date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public."Playlist" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16691)
-- Name: Playlist_p_pid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Playlist_p_pid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Playlist_p_pid_seq" OWNER TO postgres;

--
-- TOC entry 3771 (class 0 OID 0)
-- Dependencies: 216
-- Name: Playlist_p_pid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Playlist_p_pid_seq" OWNED BY public."Playlist".p_pid;


--
-- TOC entry 219 (class 1259 OID 16709)
-- Name: Song; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Song" (
    s_sid integer NOT NULL,
    s_artistid integer NOT NULL,
    s_albumid integer,
    s_title character varying(200) NOT NULL,
    s_duration time without time zone NOT NULL,
    s_genre character varying(50),
    s_release_date date,
    s_track_number integer,
    s_rating numeric(2,1) DEFAULT 0,
    CONSTRAINT "Song_s_rating_check" CHECK (((s_rating >= (0)::numeric) AND (s_rating <= (5)::numeric))),
    CONSTRAINT "Song_s_release_date_check" CHECK ((s_release_date <= CURRENT_DATE)),
    CONSTRAINT check_song_rating CHECK (((s_rating >= (0)::numeric) AND (s_rating <= (5)::numeric))),
    CONSTRAINT check_song_release_date CHECK ((s_release_date <= CURRENT_DATE))
);


ALTER TABLE public."Song" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16708)
-- Name: Song_s_sid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Song_s_sid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Song_s_sid_seq" OWNER TO postgres;

--
-- TOC entry 3772 (class 0 OID 0)
-- Dependencies: 218
-- Name: Song_s_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Song_s_sid_seq" OWNED BY public."Song".s_sid;


--
-- TOC entry 210 (class 1259 OID 16645)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    u_uid integer NOT NULL,
    u_username character varying(50) NOT NULL,
    u_password character varying(255) NOT NULL,
    u_email character varying(100) NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16644)
-- Name: User_u_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_u_uid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_u_uid_seq" OWNER TO postgres;

--
-- TOC entry 3773 (class 0 OID 0)
-- Dependencies: 209
-- Name: User_u_uid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_u_uid_seq" OWNED BY public."User".u_uid;


--
-- TOC entry 221 (class 1259 OID 16783)
-- Name: song_in_library; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.song_in_library (
    u_uid integer NOT NULL,
    s_sid integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.song_in_library OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16765)
-- Name: song_in_playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.song_in_playlist (
    p_pid integer NOT NULL,
    s_sid integer NOT NULL,
    "position" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.song_in_playlist OWNER TO postgres;

--
-- TOC entry 3562 (class 2604 OID 16679)
-- Name: Album al_albumid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Album" ALTER COLUMN al_albumid SET DEFAULT nextval('public."Album_al_albumid_seq"'::regclass);


--
-- TOC entry 3561 (class 2604 OID 16669)
-- Name: Artist ar_artistid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Artist" ALTER COLUMN ar_artistid SET DEFAULT nextval('public."Artist_ar_artistid_seq"'::regclass);


--
-- TOC entry 3564 (class 2604 OID 16695)
-- Name: Playlist p_pid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Playlist" ALTER COLUMN p_pid SET DEFAULT nextval('public."Playlist_p_pid_seq"'::regclass);


--
-- TOC entry 3566 (class 2604 OID 16712)
-- Name: Song s_sid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Song" ALTER COLUMN s_sid SET DEFAULT nextval('public."Song_s_sid_seq"'::regclass);


--
-- TOC entry 3560 (class 2604 OID 16648)
-- Name: User u_uid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN u_uid SET DEFAULT nextval('public."User_u_uid_seq"'::regclass);


--
-- TOC entry 3756 (class 0 OID 16676)
-- Dependencies: 215
-- Data for Name: Album; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Album" (al_albumid, al_artistid, al_title, al_release_date, al_album_art) FROM stdin;
1	1	1989	2014-10-27	default.png
2	2	25	2015-11-20	default.png
3	3	Divide	2017-03-03	default.png
4	4	When We All Fall Asleep, Where Do We Go?	2019-03-29	default.png
5	5	After Hours	2020-03-20	default.png
6	6	Doo-Wops & Hooligans	2010-10-04	default.png
7	7	Scorpion	2018-06-29	default.png
8	8	Future Nostalgia	2020-03-27	default.png
9	9	Camila	2018-01-12	default.png
10	10	The Eminem Show	2002-05-26	default.png
11	11	Mylo Xyloto	2011-10-24	default.png
12	12	Meteora	2003-03-25	default.png
\.


--
-- TOC entry 3754 (class 0 OID 16666)
-- Dependencies: 213
-- Data for Name: Artist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Artist" (ar_artistid, ar_artistname, ar_biography, ar_country, ar_birth_year, ar_death_year) FROM stdin;
1	Taylor Swift	American singer-songwriter	USA	1989	\N
2	Adele	British singer-songwriter	UK	1988	\N
3	Ed Sheeran	English singer-songwriter	UK	1991	\N
4	Billie Eilish	American singer-songwriter	USA	2001	\N
5	The Weeknd	Canadian singer	Canada	1990	\N
6	Bruno Mars	American singer	USA	1985	\N
7	Drake	Canadian rapper	Canada	1986	\N
8	Dua Lipa	English singer	UK	1995	\N
9	Camila Cabello	American singer	USA	1997	\N
10	Eminem	American rapper	USA	1972	\N
11	Coldplay	British rock band	UK	1996	\N
12	Linkin Park	American rock band	USA	1996	\N
\.


--
-- TOC entry 3752 (class 0 OID 16655)
-- Dependencies: 211
-- Data for Name: Library; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Library" (u_uid) FROM stdin;
1
2
\.


--
-- TOC entry 3758 (class 0 OID 16692)
-- Dependencies: 217
-- Data for Name: Playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Playlist" (p_pid, p_uid, p_title, p_description, p_creation_date) FROM stdin;
4	1	Demo	Songs in General	2025-12-01
\.


--
-- TOC entry 3760 (class 0 OID 16709)
-- Dependencies: 219
-- Data for Name: Song; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Song" (s_sid, s_artistid, s_albumid, s_title, s_duration, s_genre, s_release_date, s_track_number, s_rating) FROM stdin;
1	1	1	Blank Space	00:03:51	Pop	2014-10-27	1	4.8
5	1	1	Style	00:03:51	Pop	2014-10-27	2	4.7
2	2	2	Hello	00:04:55	Soul	2015-10-23	1	5.0
26	3	3	Shape of You	00:03:53	Pop	2017-01-06	4	4.7
27	3	3	Perfect	00:04:23	Pop	2017-03-03	5	4.9
28	4	4	Bad Guy	00:03:14	Electropop	2019-03-29	2	4.6
29	4	4	When the Party's Over	00:03:16	Alternative	2019-01-30	6	4.7
30	5	5	Blinding Lights	00:03:20	Synthwave	2019-11-29	9	4.9
31	5	5	Starboy	00:03:50	R&B	2016-09-22	1	4.8
32	6	6	Uptown Funk	00:04:30	Funk	2014-11-10	7	4.8
33	6	6	Just the Way You Are	00:03:40	Pop	2010-09-20	1	4.7
34	7	7	God's Plan	00:03:19	Hip-Hop	2018-01-19	3	4.6
35	7	7	Hotline Bling	00:04:27	R&B	2015-07-31	2	4.5
36	8	8	Levitating	00:03:23	Pop	2020-03-27	5	4.7
37	8	8	Don't Start Now	00:03:03	Disco	2019-11-01	1	4.8
38	9	9	Havana	00:03:36	Pop	2017-08-03	3	4.5
39	9	9	Never Be the Same	00:03:47	Pop	2018-01-09	2	4.4
40	10	10	Lose Yourself	00:05:26	Hip-Hop	2002-10-28	1	4.9
41	10	10	The Real Slim Shady	00:04:44	Hip-Hop	2000-05-16	6	4.8
42	11	11	Viva La Vida	00:04:02	Alternative	2008-05-25	7	4.8
43	11	11	Paradise	00:04:38	Alternative	2011-09-12	3	4.7
44	12	12	Numb	00:03:07	Rock	2003-09-08	13	4.9
45	12	12	In the End	00:03:36	Rock	2001-10-09	8	4.9
\.


--
-- TOC entry 3751 (class 0 OID 16645)
-- Dependencies: 210
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (u_uid, u_username, u_password, u_email) FROM stdin;
1	shubham	$2b$10$gJTTWdoeECf9r0x6RXdPLuh3ewp6muQ/uDx.Y4hcfR0D5IiqA7i46	shubham@example.com
2	anshika	$2b$10$W9oGp.br0L6aMp.S5ooL.exOPtsMNDPqABRBwi/Ty6Bsn8.HwUXVS	anshika@example.com
\.


--
-- TOC entry 3762 (class 0 OID 16783)
-- Dependencies: 221
-- Data for Name: song_in_library; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.song_in_library (u_uid, s_sid, added_at) FROM stdin;
1	1	2025-12-01 18:56:27.221189
1	2	2025-12-01 18:56:33.934209
1	5	2025-12-01 18:56:35.606764
1	28	2025-12-01 20:07:28.418572
\.


--
-- TOC entry 3761 (class 0 OID 16765)
-- Dependencies: 220
-- Data for Name: song_in_playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.song_in_playlist (p_pid, s_sid, "position") FROM stdin;
4	28	1
\.


--
-- TOC entry 3774 (class 0 OID 0)
-- Dependencies: 214
-- Name: Album_al_albumid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Album_al_albumid_seq"', 12, true);


--
-- TOC entry 3775 (class 0 OID 0)
-- Dependencies: 212
-- Name: Artist_ar_artistid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Artist_ar_artistid_seq"', 12, true);


--
-- TOC entry 3776 (class 0 OID 0)
-- Dependencies: 216
-- Name: Playlist_p_pid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Playlist_p_pid_seq"', 4, true);


--
-- TOC entry 3777 (class 0 OID 0)
-- Dependencies: 218
-- Name: Song_s_sid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Song_s_sid_seq"', 45, true);


--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 209
-- Name: User_u_uid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_u_uid_seq"', 2, true);


--
-- TOC entry 3589 (class 2606 OID 16685)
-- Name: Album Album_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Album"
    ADD CONSTRAINT "Album_pkey" PRIMARY KEY (al_albumid);


--
-- TOC entry 3587 (class 2606 OID 16674)
-- Name: Artist Artist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Artist"
    ADD CONSTRAINT "Artist_pkey" PRIMARY KEY (ar_artistid);


--
-- TOC entry 3585 (class 2606 OID 16659)
-- Name: Library Library_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Library"
    ADD CONSTRAINT "Library_pkey" PRIMARY KEY (u_uid);


--
-- TOC entry 3591 (class 2606 OID 16700)
-- Name: Playlist Playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Playlist"
    ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY (p_pid);


--
-- TOC entry 3595 (class 2606 OID 16717)
-- Name: Song Song_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Song"
    ADD CONSTRAINT "Song_pkey" PRIMARY KEY (s_sid);


--
-- TOC entry 3579 (class 2606 OID 16650)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (u_uid);


--
-- TOC entry 3581 (class 2606 OID 16654)
-- Name: User User_u_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_u_email_key" UNIQUE (u_email);


--
-- TOC entry 3583 (class 2606 OID 16652)
-- Name: User User_u_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_u_username_key" UNIQUE (u_username);


--
-- TOC entry 3601 (class 2606 OID 16788)
-- Name: song_in_library song_in_library_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_library
    ADD CONSTRAINT song_in_library_pkey PRIMARY KEY (u_uid, s_sid);


--
-- TOC entry 3597 (class 2606 OID 16772)
-- Name: song_in_playlist song_in_playlist_p_pid_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_playlist
    ADD CONSTRAINT song_in_playlist_p_pid_position_key UNIQUE (p_pid, "position");


--
-- TOC entry 3599 (class 2606 OID 16770)
-- Name: song_in_playlist song_in_playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_playlist
    ADD CONSTRAINT song_in_playlist_pkey PRIMARY KEY (p_pid, s_sid);


--
-- TOC entry 3593 (class 2606 OID 16800)
-- Name: Playlist unique_title_per_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Playlist"
    ADD CONSTRAINT unique_title_per_user UNIQUE (p_uid, p_title);


--
-- TOC entry 3603 (class 2606 OID 16801)
-- Name: Album Album_al_artistid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Album"
    ADD CONSTRAINT "Album_al_artistid_fkey" FOREIGN KEY (al_artistid) REFERENCES public."Artist"(ar_artistid) ON DELETE CASCADE;


--
-- TOC entry 3602 (class 2606 OID 16660)
-- Name: Library Library_u_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Library"
    ADD CONSTRAINT "Library_u_uid_fkey" FOREIGN KEY (u_uid) REFERENCES public."User"(u_uid) ON DELETE CASCADE;


--
-- TOC entry 3604 (class 2606 OID 16816)
-- Name: Playlist Playlist_p_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Playlist"
    ADD CONSTRAINT "Playlist_p_uid_fkey" FOREIGN KEY (p_uid) REFERENCES public."User"(u_uid) ON DELETE CASCADE;


--
-- TOC entry 3605 (class 2606 OID 16811)
-- Name: Song Song_s_albumid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Song"
    ADD CONSTRAINT "Song_s_albumid_fkey" FOREIGN KEY (s_albumid) REFERENCES public."Album"(al_albumid) ON DELETE SET NULL;


--
-- TOC entry 3606 (class 2606 OID 16806)
-- Name: Song Song_s_artistid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Song"
    ADD CONSTRAINT "Song_s_artistid_fkey" FOREIGN KEY (s_artistid) REFERENCES public."Artist"(ar_artistid) ON DELETE CASCADE;


--
-- TOC entry 3609 (class 2606 OID 16794)
-- Name: song_in_library song_in_library_s_sid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_library
    ADD CONSTRAINT song_in_library_s_sid_fkey FOREIGN KEY (s_sid) REFERENCES public."Song"(s_sid) ON DELETE CASCADE;


--
-- TOC entry 3610 (class 2606 OID 16789)
-- Name: song_in_library song_in_library_u_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_library
    ADD CONSTRAINT song_in_library_u_uid_fkey FOREIGN KEY (u_uid) REFERENCES public."Library"(u_uid) ON DELETE CASCADE;


--
-- TOC entry 3607 (class 2606 OID 16773)
-- Name: song_in_playlist song_in_playlist_p_pid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_playlist
    ADD CONSTRAINT song_in_playlist_p_pid_fkey FOREIGN KEY (p_pid) REFERENCES public."Playlist"(p_pid) ON DELETE CASCADE;


--
-- TOC entry 3608 (class 2606 OID 16778)
-- Name: song_in_playlist song_in_playlist_s_sid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song_in_playlist
    ADD CONSTRAINT song_in_playlist_s_sid_fkey FOREIGN KEY (s_sid) REFERENCES public."Song"(s_sid) ON DELETE CASCADE;


--
-- TOC entry 3768 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: shubham_k
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-12-01 20:52:01 MST

--
-- PostgreSQL database dump complete
--

\unrestrict ehVdUHzfCsW1AVR5JjEgSBln8hs89gJ7ZRgr9yOyHci1aKYpUA69lQe2QfNY0Tr

