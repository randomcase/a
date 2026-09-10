import { CaseFolder } from '../types';

export const INITIAL_CASES: CaseFolder[] = [
  // --- DISTRICT COURT ---
  {
    id: 'case_dist_1',
    docketNumber: 'No. 24-CV-1082 (D. Mass.)',
    court: 'district',
    caption: 'Oakhaven Homeowners Ass’n v. Sterling Robotics Corp.',
    petitioner: 'Oakhaven Homeowners Ass’n',
    respondent: 'Sterling Robotics Corp.',
    termYear: 'October Term 2024',
    issue: 'Whether an autonomous robotic landscaping unit that repeatedly crosses private boundary lines during self-calibration constitutes a common-law trespass and nuisance.',
    facts: 'Respondent Sterling Robotics deployed experimental autonomous lawn care machines in the suburban subdivision of Oakhaven. Several units deviated from mapped boundaries at 2:00 AM due to LIDAR reflection from dew, crossing onto petitioner’s private lawns and triggering exterior alarms.',
    precedentCasesCited: [
      'Entick v. Carrington, 95 Eng. Rep. 807 (C.P. 1765)',
      'United States v. Causby, 328 U.S. 256 (1946)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch1', description: 'Purge archaic phrases ("heretofore", "said premises")', passed: false },
      { ruleId: 'style_ch2', description: 'Active voice identification of the trespassing actor', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Plaintiff moves for a preliminary injunction enjoining respondent from operating autonomous units within 50 feet of lot boundaries pending trial.',
      majorityDraft: 'The bench must decide whether physical intrusion by automated code constitutes actionable physical trespass under federal diversity jurisdiction.',
      choicePoints: [
        {
          id: 'cp_dist_1_intro',
          prompt: 'Draft the opening statement of the bench order (Style Manual Chapter 1 & 2):',
          choices: [
            {
              id: 'c1',
              text: 'Come now the aforementioned plaintiffs wherein it is herein alleged that said robotic instrumentalities did intrude onto aforesaid real estate.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Infested with archaic filler words that degrade judicial majesty.',
            },
            {
              id: 'c2',
              text: 'The Oakhaven Homeowners Association seeks a preliminary injunction to stop Sterling Robotics from deploying autonomous mowers that enter private property.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 40,
              reasoning: 'Pristine Plain English. Immediately establishes parties, procedural posture, and relief sought.',
            },
            {
              id: 'c3',
              text: 'An injunction is asked for by plaintiffs regarding the robots.',
              styleRating: 'Passable',
              precedentBonusPercent: 15,
              reasoning: 'Passive voice and slightly colloquial phrasing.',
            },
          ],
        },
        {
          id: 'cp_dist_1_holding',
          prompt: 'Formulate the preliminary injunction legal syllogism (Style Manual Chapter 4):',
          choices: [
            {
              id: 'c4',
              text: 'Because robots are annoying at night, we order them stopped because equity favors sleep.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Lacks legal framework and Aristotelian syllogism.',
            },
            {
              id: 'c5',
              text: 'A preliminary injunction requires likelihood of success on the merits and irreparable harm. Unconsented physical intrusion upon real property violates ancient common-law rights that monetary damages cannot undo. Therefore, the injunction must issue.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 50,
              reasoning: 'Textbook judicial syllogism: Major Premise (Rule), Minor Premise (Application), Holding (Remedy).',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED'],
    basePrecedentReward: 400,
    status: 'pending',
  },
  {
    id: 'case_dist_2',
    docketNumber: 'No. 24-CV-2240 (S.D.N.Y.)',
    court: 'district',
    caption: 'Dr. Aris Thorne v. Vanguard BioLabs International',
    petitioner: 'Dr. Aris Thorne',
    respondent: 'Vanguard BioLabs International',
    termYear: 'November Term 2024',
    issue: 'Enforceability of a worldwide five-year non-compete covenant against a gene-editing researcher under state public policy.',
    facts: 'Dr. Thorne resigned from Vanguard BioLabs to direct an academic non-profit malaria therapy initiative. Vanguard brought suit under an employment contract containing a five-year worldwide restrictive covenant covering any genetic engineering research.',
    precedentCasesCited: [
      'BDO Seidman v. Hirshberg, 93 N.Y.2d 382 (1999)',
      'Mitchel v. Reynolds, 1 P. Wms. 181 (1711)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch2', description: 'Active voice attribution of covenant overbreadth', passed: false },
      { ruleId: 'style_ch5', description: 'Limit holding strictly to non-profit humanitarian carve-outs', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Dr. Thorne moves for summary judgment declaring the worldwide restrictive covenant unreasonable as a matter of law.',
      majorityDraft: 'Courts scrutinize post-employment non-compete agreements with intense skepticism when applied to essential scientific inquiry.',
      choicePoints: [
        {
          id: 'cp_dist_2_reasoning',
          prompt: 'Frame the restraint-of-trade analysis adhering to Judicial Restraint (Chapter 5):',
          choices: [
            {
              id: 'c1',
              text: 'All non-compete clauses in America are evil corporate shackles and we declare every single one void nationwide.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Rogue dicta far exceeding the court’s Article III authority.',
            },
            {
              id: 'c2',
              text: 'Under New York law, a restrictive covenant is unenforceable if it is broader than necessary to protect a legitimate business interest. A five-year worldwide ban on non-profit malaria research exceeds any protectable commercial interest of Vanguard.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 45,
              reasoning: 'Tailored rule application with zero superfluous dicta.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED'],
    basePrecedentReward: 650,
    status: 'pending',
  },
  {
    id: 'case_dist_3',
    docketNumber: 'No. 25-CV-0419 (N.D. Cal.)',
    court: 'district',
    caption: 'City of Pacifica v. Oceanic Deepwater Dredging Co.',
    petitioner: 'City of Pacifica',
    respondent: 'Oceanic Deepwater Dredging Co.',
    termYear: 'January Term 2025',
    issue: 'Whether offshore industrial dredging without a municipal coastal permit triggers federal Clean Water Act strict liability.',
    facts: 'Oceanic Dredging conducted nearshore sediment extraction resulting in turbidity plume drift into designated municipal marine sanctuaries during whale migration season.',
    precedentCasesCited: [
      'County of Maui v. Hawaii Wildlife Fund, 140 S. Ct. 1462 (2020)',
      'Chevron U.S.A. Inc. v. Natural Resources Defense Council, 467 U.S. 837 (1984)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch3', description: 'Clean statutory citation to 33 U.S.C. § 1311(a)', passed: false },
      { ruleId: 'style_ch4', description: 'Functional equivalence test syllogism', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Cross-motions for partial summary judgment on Clean Water Act discharge liability.',
      majorityDraft: 'Sediment plume migration through navigable coastal waters requires statutory discharge permitting.',
      choicePoints: [
        {
          id: 'cp_dist_3_rule',
          prompt: 'Formulate the Clean Water Act statutory standard (Chapter 3 & 4):',
          choices: [
            {
              id: 'c1',
              text: 'The Clean Water Act forbids the unpermitted addition of any pollutant from a point source to navigable waters. 33 U.S.C. § 1311(a). Dredged spoil is an enumerated pollutant under the Act. 33 U.S.C. § 1362(6). Oceanic discharged spoil into federal waters without a permit.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 50,
              reasoning: 'Impeccable statutory citations and crisp syllogism.',
            },
            {
              id: 'c2',
              text: 'Oceanic made the water dirty and under various federal codes that is strictly illegal.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'No statutory references, vague colloquial terms.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED'],
    basePrecedentReward: 900,
    status: 'pending',
  },

  // --- CIRCUIT COURT OF APPEALS ---
  {
    id: 'case_circ_1',
    docketNumber: 'No. 25-1492 (2d Cir.)',
    court: 'circuit',
    caption: 'Aegis Autonomous Protocol v. Securities & Exchange Comm’n',
    petitioner: 'Aegis Autonomous Protocol (Decentralized DAO)',
    respondent: 'Securities & Exchange Commission',
    termYear: 'February Term 2025',
    issue: 'Does an autonomous liquidity pool governed solely by immutable smart contract logic constitute a "common enterprise" under the Howey Test?',
    facts: 'The SEC instituted enforcement proceedings against Aegis, alleging that automated yield distribution tokens constituted unregistered securities. The District Court dismissed the SEC complaint, holding that decentralized immutable code lacks an identifiable managerial promoter.',
    precedentCasesCited: [
      'SEC v. W.J. Howey Co., 328 U.S. 293 (1946)',
      'Reves v. Ernst & Young, 494 U.S. 56 (1990)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch2', description: 'Clarity on standard of review: De Novo for statutory definitions', passed: false },
      { ruleId: 'style_ch3', description: 'Proper Bluebook citation to Howey and its progeny', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Appeal from the District Court for the Southern District of New York granting defendant’s motion to dismiss for lack of subject matter jurisdiction.',
      majorityDraft: 'We review the district court’s dismissal de novo, accepting all factual allegations as true.',
      choicePoints: [
        {
          id: 'cp_circ_1_review',
          prompt: 'Articulate the appellate standard of review (Style Manual Chapter 2 & 4):',
          choices: [
            {
              id: 'c1',
              text: 'We review de novo a district court’s grant of a motion to dismiss under Rule 12(b)(6), asking whether the complaint contains sufficient factual matter to state a claim to relief that is plausible on its face.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 40,
              reasoning: 'Standard appellate formulation cited with flawless precision.',
            },
            {
              id: 'c2',
              text: 'The trial judge seemed confused, so we will re-evaluate everything from scratch ourselves.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Disrespectful tone violating appellate decorum.',
            },
          ],
        },
        {
          id: 'cp_circ_1_howey',
          prompt: 'Apply the Howey legal doctrine to immutable software protocols:',
          choices: [
            {
              id: 'c3',
              text: 'The Howey test requires an investment of money in a common enterprise with profits derived solely from the efforts of others. SEC v. W.J. Howey Co., 328 U.S. 293, 298–99 (1946). When profits flow exclusively from mathematical arbitrage executed by unalterable code rather than managerial efforts, the statutory definition is not satisfied.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 50,
              reasoning: 'Clear statutory fidelity and masterful application of Supreme Court precedent.',
            },
            {
              id: 'c4',
              text: 'Cryptocurrency is new and cool, so old laws from the orange grove era do not count anymore.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Fails to apply stare decisis or substantive legal analysis.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED', 'EN BANC VACATED'],
    basePrecedentReward: 3500,
    status: 'pending',
  },
  {
    id: 'case_circ_2',
    docketNumber: 'No. 25-2810 (9th Cir.)',
    court: 'circuit',
    caption: 'Warden Miller v. Jonathan Vance',
    petitioner: 'Warden Miller (State of California)',
    respondent: 'Jonathan Vance',
    termYear: 'March Term 2025',
    issue: 'Whether the state’s withholding of raw computer forensic metadata violates Brady v. Maryland when the defense lacked proprietary software to parse it.',
    facts: 'Vance was convicted of wire fraud. Ten years later, a whistleblower revealed the state possessed raw server packet logs that exonerated Vance’s IP address, which the prosecution withheld claiming the files were unreadable without specialized software.',
    precedentCasesCited: [
      'Brady v. Maryland, 373 U.S. 83 (1963)',
      'Kyles v. Whitley, 514 U.S. 419 (1995)',
      'Strickler v. Greene, 527 U.S. 263 (1999)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch2', description: 'Active voice detailing prosecutorial suppression', passed: false },
      { ruleId: 'style_ch4', description: 'Three-prong Brady materiality test formulation', passed: false },
    ],
    draftOpinion: {
      syllabus: 'State appeals the grant of a writ of habeas corpus vacating respondent’s conviction under 28 U.S.C. § 2254.',
      majorityDraft: 'A prosecutor’s duty under Brady is not discharged by burying exculpatory evidence under technical obscurity.',
      choicePoints: [
        {
          id: 'cp_circ_2_brady',
          prompt: 'Draft the constitutional holding on digital evidence disclosure:',
          choices: [
            {
              id: 'c1',
              text: 'To establish a Brady violation, the defendant must show that the evidence was favorable, suppressed by the State, and material to guilt or punishment. Exculpatory data does not become immune from disclosure merely because it requires software to read. The State suppresses evidence when it deliberately conceals its existence.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 55,
              reasoning: 'Authoritative, exact, and elevates Circuit precedent with enduring clarity.',
            },
            {
              id: 'c2',
              text: 'It is really unfair for the government to hide computer logs, so habeas corpus should be granted.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Lacks constitutional rigor and the three-prong Brady test.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED', 'EN BANC VACATED'],
    basePrecedentReward: 4800,
    status: 'pending',
  },
  {
    id: 'case_circ_3',
    docketNumber: 'No. 25-3304 (5th Cir.)',
    court: 'circuit',
    caption: 'Atlas Logistics Corp. v. United Dockworkers Local 412',
    petitioner: 'Atlas Logistics Corp.',
    respondent: 'United Dockworkers Local 412',
    termYear: 'May Term 2025',
    issue: 'Scope of the transportation worker exemption under Section 1 of the Federal Arbitration Act for warehouse automated crane operators.',
    facts: 'Warehouse crane operators loading intermodal shipping containers were forced into individual arbitration agreements. The union brought an en banc petition arguing they are exempt transportation workers engaged in foreign commerce.',
    precedentCasesCited: [
      'Circuit City Stores, Inc. v. Adams, 532 U.S. 105 (2001)',
      'Southwest Airlines Co. v. Saxon, 596 U.S. 450 (2022)',
      'Bissonnette v. LePage Bakeries Park St., LLC, 601 U.S. 246 (2024)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch1', description: 'Zero archaic Latin filler words', passed: false },
      { ruleId: 'style_ch3', description: 'Strict textual statutory interpretation', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Interlocutory appeal from an order compelling arbitration under 9 U.S.C. § 4.',
      majorityDraft: 'We interpret Section 1 of the Federal Arbitration Act according to its ordinary public meaning at the time of enactment in 1925.',
      choicePoints: [
        {
          id: 'cp_circ_3_text',
          prompt: 'Draft the statutory interpretation paragraph (Chapter 1 & 4):',
          choices: [
            {
              id: 'c1',
              text: 'Section 1 exempts "contracts of employment of seamen, railroad employees, or any other class of workers engaged in foreign or interstate commerce." Workers who physically load and unload cargo bound for overseas transit play a direct and necessary role in the transportation of goods, exempting them from compulsory individual arbitration.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 50,
              reasoning: 'Grounded in statutory text and supreme precedent (Saxon and Bissonnette).',
            },
            {
              id: 'c2',
              text: 'The aforementioned respondents do herein perform maritime functions of said nature, inter alia, and should be exempt.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Dreadful legalese ("herein", "said nature", "inter alia").',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'REMANDED', 'EN BANC VACATED'],
    basePrecedentReward: 6200,
    status: 'pending',
  },

  // --- THE SUPREME COURT OF THE UNITED STATES ---
  {
    id: 'case_scotus_1',
    docketNumber: 'No. 26-89 (SCOTUS)',
    court: 'supreme',
    caption: 'Nova NeuroTech Corp. v. United States of America',
    petitioner: 'Nova NeuroTech Corp. and Jane Doe, Ph.D.',
    respondent: 'United States of America',
    termYear: 'October Term 2026',
    issue: 'Whether the government’s warrantless passive interception of human cognitive neural telemetry in public transit hubs violates the Fourth Amendment.',
    facts: 'The Department of Homeland Security installed passive sub-millimeter neural scanners at major railway hubs to identify "anomalous stress signatures." Dr. Doe challenged the surveillance after her biometric neural telemetry was recorded and cataloged without a warrant or individual suspicion.',
    precedentCasesCited: [
      'Katz v. United States, 389 U.S. 347 (1967)',
      'Kyllo v. United States, 533 U.S. 27 (2001)',
      'Carpenter v. United States, 138 S. Ct. 2206 (2018)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch2', description: 'Active voice declaring personal mental sanctuary', passed: false },
      { ruleId: 'style_ch5', description: 'Careful containment of the holding without expansive dicta', passed: false },
      { ruleId: 'style_ch6', description: 'Enduring constitutional dignity suitable for the U.S. Reports', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Certiorari to the United States Court of Appeals for the District of Columbia Circuit. The Court considers whether the Fourth Amendment protects the privacy of human neural brainwaves against warrantless electronic scanning.',
      majorityDraft: 'We granted certiorari to address whether the Constitution permits the government to peer into the human mind without a warrant.',
      choicePoints: [
        {
          id: 'cp_scotus_1_katz',
          prompt: 'Draft the landmark constitutional opening for the United States Reports:',
          choices: [
            {
              id: 'c1',
              text: 'The Fourth Amendment protects people, not places. Katz v. United States, 389 U.S. 347, 351 (1967). If any sanctuary lies beyond the warrantless intrusion of the State, it is the sanctuary of human thought. When government sensors cross that threshold to decipher subconscious neural impulses, a Fourth Amendment search occurs.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 60,
              reasoning: 'Monumental constitutional prose. Merges classic precedent with technological frontiers.',
            },
            {
              id: 'c2',
              text: 'Brain scanning is invasive and creepy so we are striking it down under the Constitution.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Lacks constitutional framing, historical lineage, and judicial dignity.',
            },
          ],
        },
        {
          id: 'cp_scotus_1_dicta',
          prompt: 'Draft the concluding holding adhering to Judicial Restraint (Chapter 5):',
          choices: [
            {
              id: 'c3',
              text: 'We hold that warrantless passive neural scanning of individuals in public spaces constitutes an unreasonable search under the Fourth Amendment. We do not decide questions involving voluntary medical diagnostic telemetry or consented security clearances.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 50,
              reasoning: 'Defines the landmark holding while prudently excluding unpresented edge cases.',
            },
            {
              id: 'c4',
              text: 'We hold that all technology scanning any human body anywhere forever is unconstitutional.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Sweeping dicta that will provoke endless circuit confusion.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'CERTIORARI GRANTED', 'CERTIORARI DENIED'],
    basePrecedentReward: 25000,
    status: 'pending',
    dissentAvailable: true,
  },
  {
    id: 'case_scotus_2',
    docketNumber: 'No. 26-214 (SCOTUS)',
    caption: 'Citizens for Cryptographic Assembly v. Federal Election Comm’n',
    court: 'supreme',
    petitioner: 'Citizens for Cryptographic Assembly',
    respondent: 'Federal Election Commission',
    termYear: 'December Term 2026',
    issue: 'Does the First Amendment protect the right of political associations to distribute campaign literature using zero-knowledge cryptographic anonymity?',
    facts: 'The Federal Election Commission prohibited political advocacy groups from publishing digital circulars unless authors attached verified government identity signatures. Petitioners argue this infringes upon the historical tradition of anonymous political pamphleteering.',
    precedentCasesCited: [
      'Talley v. California, 362 U.S. 60 (1960)',
      'McIntyre v. Ohio Elections Comm’n, 514 U.S. 334 (1995)',
      'Citizens United v. FEC, 558 U.S. 310 (2010)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch2', description: 'Active voice defense of the Federalist Papers heritage', passed: false },
      { ruleId: 'style_ch6', description: 'Harmonious majority or sharp principled dissent', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Certiorari to the United States Court of Appeals for the Fourth Circuit.',
      majorityDraft: 'Anonymous pamphleteering is not a pernicious, fraudulent practice, but an honorable tradition of advocacy and dissent.',
      choicePoints: [
        {
          id: 'cp_scotus_2_first',
          prompt: 'Author the First Amendment holding honoring Supreme Court Style Manual standards:',
          choices: [
            {
              id: 'c1',
              text: 'Under the First Amendment, the freedom to speak includes the freedom to speak anonymously. McIntyre v. Ohio Elections Comm’n, 514 U.S. 334, 342 (1995). The Federalist Papers themselves were published under the pseudonym Publius. The government cannot condition participation in political discourse on the surrender of cryptographic privacy.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 65,
              reasoning: 'Masterful historical resonance, robust First Amendment lineage, and crystal clear holding.',
            },
            {
              id: 'c2',
              text: 'It is herein decreed that said FEC rule is unconstitutional pursuant to the aforementioned First Amendment provisions, inter alia.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Degrades a landmark First Amendment ruling into bureaucratic gibberish.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'CERTIORARI GRANTED', 'CERTIORARI DENIED'],
    basePrecedentReward: 42000,
    status: 'pending',
    dissentAvailable: true,
  },
  {
    id: 'case_scotus_3',
    docketNumber: 'No. 26-401 (SCOTUS)',
    caption: 'State of Vermont & Massachusetts v. Federal Energy Regulatory Comm’n',
    court: 'supreme',
    petitioner: 'State of Vermont, Commonwealth of Massachusetts',
    respondent: 'Federal Energy Regulatory Commission',
    termYear: 'March Term 2027',
    issue: 'Whether the Federal Power Act preempts state laws mandating 100% renewable electrical grid procurement within sovereign state borders.',
    facts: 'FERC issued a rule barring states from enforcing preferential zero-carbon renewable energy portfolio standards, asserting federal wholesale interstate market preemption. States petitioned for certiorari on Tenth Amendment and cooperative federalism grounds.',
    precedentCasesCited: [
      'Hughes v. Talen Energy Marketing, LLC, 578 U.S. 150 (2016)',
      'FERC v. Electric Power Supply Ass’n, 577 U.S. 260 (2016)',
      'New York v. United States, 505 U.S. 144 (1992)',
    ],
    benchMemoStyleChecklist: [
      { ruleId: 'style_ch4', description: 'Dual sovereignty syllogism', passed: false },
      { ruleId: 'style_ch6', description: 'Preserving the constitutional architecture of Federalism', passed: false },
    ],
    draftOpinion: {
      syllabus: 'Certiorari to the United States Court of Appeals for the First Circuit. Preemption analysis under 16 U.S.C. § 824(b)(1).',
      majorityDraft: 'Our Constitution establishes a system of dual sovereignty, where the States retain substantial police powers over local utilities.',
      choicePoints: [
        {
          id: 'cp_scotus_3_federalism',
          prompt: 'Draft the definitive federalism opinion closing:',
          choices: [
            {
              id: 'c1',
              text: 'The Federal Power Act explicitly reserves to the States the authority over retail sales and generation facilities within their borders. 16 U.S.C. § 824(b)(1). Federal preemption does not expand by bureaucratic ambition. When Congress leaves a sphere of authority to sovereign States, federal agencies may not commandeer it.',
              styleRating: 'Supreme Elegance',
              precedentBonusPercent: 70,
              reasoning: 'Flawless constitutional jurisprudence, statutory accuracy, and robust federalism protection.',
            },
            {
              id: 'c2',
              text: 'Clean energy is green and good so the federal government must lose this lawsuit.',
              styleRating: 'Flawed Legalese',
              precedentBonusPercent: 0,
              reasoning: 'Policy sentiment instead of constitutional statutory jurisprudence.',
            },
          ],
        },
      ],
    },
    availableRulings: ['AFFIRMED', 'REVERSED', 'CERTIORARI GRANTED', 'CERTIORARI DENIED'],
    basePrecedentReward: 65000,
    status: 'pending',
    dissentAvailable: true,
  },
];
