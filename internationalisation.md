# Internationalisation Nolice — Analyse de complexité et points de blocage

## Context

L'app Nolice (jeu éducatif Android pour enfants de 3 ans, FR-only) doit être étendue à l'anglais. Public jeune → pas de sélecteur de langue dans l'UI, détection automatique au boot. L'objectif de ce document est **d'identifier les blocages potentiels et d'évaluer la complexité réelle** avant de s'engager dans l'implémentation, pas de planifier le code.

## Stratégie retenue (issue des questions préalables)

- App unique avec auto-détection de locale au boot (`expo-localization`)
- Roadmap : FR + EN, possiblement 1-2 langues additionnelles ensuite
- Fallback : EN si la locale du téléphone n'est pas supportée
- Production audio : TTS (ElevenLabs ou équivalent)
- Nom de l'app : "Nolice" universel (pas de localisation du nom système)

## État des lieux factuel (issu de l'audit)

| Élément | Volume | Localisation actuelle |
|---|---|---|
| Strings UI hardcodés | 14 occurrences | 7 fichiers `.tsx` (`MainMenu`, `GameSelectionMenu`, `FindGame`, `NumberGame`, `result-modal`, `score/index`) |
| Labels d'items (animal/couleur/forme) | 27 items | `src/screens/menu/GameSelectionMenu.tsx` + `src/screens/game/NumberGame.tsx` |
| Fichiers audio MP3 | 76 fichiers, **2.9 MB total** | `assets/audio/*.mp3` (paroles FR, noms de fichier en EN keywords) |
| Mapping audio → code | 3 objets (`SOUNDS`, `SOUNDS_COUNT_QUESTION`, `SOUNDS_QUESTION`) | `src/store/audio.ts` |
| Config app/build | `app.json`, `package.json`, `eas.json` | Zéro contenu textuel français |
| Splash + icon + SVG | 22 SVG + 4 images | Aucun texte → pas d'impact |
| Police TitilliumWeb_700Bold | 1 | Supporte FR + EN complet → pas d'impact |
| i18n libs installées | 0 | `expo-localization` à ajouter |
| Tests automatisés | 0 | Aucun test à adapter |
| Analytics Firebase | 9 events | Params déjà en anglais → pas d'impact |

## Points de blocage classés par sévérité

### 🔴 BLOCAGES MAJEURS

#### 1. Conformité légale pour apps kids (la plus critique)
- **COPPA** (US, <13 ans) : restrictions sur collecte de données, consentement parental, pas de ciblage publicitaire comportemental. Firebase Analytics doit activer le flag "child-directed" si distribution US.
- **GDPR-K** (EU, <16 ans selon État membre) : équivalent COPPA côté EU. Tu es déjà soumis pour le marché FR mais ajouter d'autres juridictions multiplie les obligations.
- **Play Store "Designed for Families"** : programme dédié, exigences strictes (pas d'ads, pas de liens externes, politique de confidentialité dans toutes les langues distribuées, content rating validé).
- **Risque** : refus de publication, retrait après publication, amendes.
- **Charge** : audit légal + éventuelle politique de confidentialité EN à publier. Non-technique. Selon contexte (perso vs commercial), de quelques heures à plusieurs jours.

#### 2. Détection de locale non testable à grande échelle
- `expo-localization.getLocales()[0]` retourne la locale top du téléphone.
- **Aucun moyen de tester exhaustivement** : il faudrait un émulateur ou device pour chaque locale (`fr-FR`, `fr-CA`, `fr-CH`, `fr-BE`, `en-US`, `en-GB`, `en-AU`, `en-IN`, `ja-JP` pour fallback…).
- Edge cases :
  - Téléphone avec liste de langues préférées (`en, fr`) → on prend la première, mais utilisateur peut être bilingue
  - Variantes régionales (`fr-CA` québécois — vocabulaire différent de `fr-FR`)
  - OEMs chinois (Xiaomi, Oppo) avec ROM modifiée → comportement parfois différent
- **Pas de filet de sécurité** car l'utilisateur ne peut pas corriger dans l'app (par design). Si détection fausse, le parent doit changer la langue système (invasif).
- **Mitigation possible** : geste caché (triple-tap sur splash) pour ouvrir un sélecteur "parents only" → tu avais rejeté cette option mais à reconsidérer comme filet de sécurité.

#### 3. Restructuration des templates de phrase
Le code actuel concatène des fragments :
- `Combien comptes-tu ${label} ?` avec `label: "de canards"` → l'article "de" est dans le label
- `Trouve ${label}` avec `label: "le canard"` → l'article "le" est dans le label
- `Trouve ${label}` avec `label: "le rouge"` → article "le" pour une couleur

En anglais :
- "How many ducks?" → pas d'article devant le pluriel
- "Find the duck" / "Find red" → article variable selon catégorie (oui pour animal/forme, non pour couleur)

**Conséquence** : on ne peut pas se contenter de traduire les 27 labels mot à mot. Il faut **changer la structure** :
- Soit phrases entières par locale (`count_question_duck`, `find_question_red` — explosion combinatoire)
- Soit templates avec fonction par locale (`(item) => `How many ${item.plural}?``)
- Soit séparer `singular`/`plural` + flag `with_article` par item

C'est du travail de refactor, pas juste de la traduction. Risque de régression sur l'UI FR existante si pas testé soigneusement.

### 🟠 BLOCAGES MODÉRÉS

#### 4. Production audio TTS — qualité et cohérence
- **76 fichiers** à générer + écouter individuellement (QA).
- **Voix consistante** : même voix pour les 76 clips, sinon l'expérience est cassée.
- **TTS "Kids voices"** : ElevenLabs en propose, mais pas toutes les voix sont adaptées (timbre, intonation). Test préalable nécessaire.
- **Pacing** : les voix TTS ont un rythme différent du FR humain. Les transitions question → réponse → BRAVO/DOMMAGE ont été tunées au rythme FR. Risque que les nouveaux audios EN se chevauchent ou laissent des silences.
- **Validation native** : idéalement un anglophone natif (ou prof de maternelle EN) écoute les 76 pour valider prononciation et adéquation pédagogique. Sans ça, risque d'erreurs subtiles (ex: "rhombus" vs "diamond" pour `losange`).
- **Charge estimée** : génération 2-4h, QA d'écoute 3-4h.

#### 5. Choix lexicaux et culturels
- `losange` → `diamond` (plus enfantin) ou `rhombus` (plus scolaire) ?
- `marron` → `brown` ✓
- "BRAVO !" → "WELL DONE!" / "GOOD JOB!" / "YAY!" — choix de ton
- "FAUX !" → "OOPS!" / "TRY AGAIN!" / "WRONG!" — un "wrong" sec peut être trop dur pour un enfant de 3 ans
- "Trouve" → "Find" mais peut-être "Tap" ou "Show me" est plus naturel pour un toddler
- **Sans validation native EN du domaine "early childhood"**, on risque un anglais correct mais peu naturel pour l'âge cible.

#### 6. Play Store ops par langue
- Title, description courte/longue, screenshots, feature graphic, video → tout localisable séparément dans Play Console.
- **Screenshots EN nécessitent un rebuild EN** pour capturer l'UI traduite.
- Reviews à modérer dans 2+ langues.
- **Charge** : 3-4h par langue ajoutée + traductions des descriptions.

#### 7. Bugs préexistants à corriger pendant l'extraction
Repérés en passant :
- `src/screens/menu/GameSelectionMenu.tsx:62` — `'le caré'` (devrait être `'le carré'`)
- `src/screens/menu/GameSelectionMenu.tsx:58` — `'le coeur'` (devrait être `'le cœur'` ou `'le coeur'` accepté)

À fixer pendant l'extraction sinon ça reste dans la version FR.

### 🟡 BLOCAGES MINEURS

#### 8. Bundle size
- Audio FR actuel : 2.9 MB pour 76 fichiers (~38 KB/clip moyenne)
- Ajout EN : +2.9 MB → APK total +3 MB (négligeable, AAB Android limite 200 MB)
- Pour 4 langues : +9 MB → toujours négligeable
- **Aucun blocage**, juste à noter pour le download mobile sur réseaux lents.

#### 9. Preload boot time
- Le preload actuel matérialise les 76 MP3 via `Asset.downloadAsync` + copie cache au démarrage (bloque le splash).
- Avec 2 langues bundlées, on peut **ne preload que la locale détectée** → pas d'impact sur le boot.
- Décision archi simple : `preloadAllAssets()` lit la locale courante et ne charge que `audio/{locale}/*`.

#### 10. Couplage entre clés enum et fichiers audio
- Les clés `DUCK`, `CAT`, `RED`, `CIRCLE`, etc. restent en EN dans le code → pas de renommage.
- Les chemins `require(...)` doivent juste devenir locale-aware : `require(`../assets/audio/${locale}/bird.mp3`)` — mais **`require()` en RN doit être statique** (le bundler analyse les imports), donc en pratique il faudra deux tables `SOUNDS_FR` et `SOUNDS_EN` avec des `require()` littéraux, puis lookup à runtime.

#### 11. Analytics et observabilité
- Pas un blocage, mais opportunité : ajouter `locale` comme param sur tous les `logEvent` pour comparer l'usage FR vs EN, et détecter si la fallback EN est trop agressive (utilisateurs FR-CA mappés EN par erreur).

#### 12. iOS — pas un blocage actuel mais à anticiper
- CLAUDE.md indique Android-only. Mais sortir une version EN augmente la pression pour aussi sortir iOS.
- Apple App Store a des règles plus strictes pour kids' apps : "Kids Category" avec consentement parental, pas de tracking, ATT framework.
- **Si iOS rentre dans le scope**, c'est un workstream parallèle aussi gros que l'i18n elle-même.

## Synthèse de complexité

### Charge de travail technique pure (sans légal ni audio)

| Tâche | Effort | Risque |
|---|---|---|
| Ajouter `expo-localization` + store de locale (`useLocaleStore`) | XS — 30 min | Faible |
| Extraire 14 strings UI + 27 labels vers `src/i18n/{fr,en}.ts` | S — 2 h | Faible |
| Refactor des templates `Trouve {x}` / `Combien comptes-tu {x}` | S — 1-2 h | Moyen |
| Réorganiser MP3 en `assets/audio/{fr,en}/` + adapter `audio.ts` | S — 2 h | Faible (préserver le fix preload Android récent) |
| Preload locale-aware (seulement la langue courante) | XS — 30 min | Faible |
| Tester sur émulateur Android avec locale EN + FR | S — 1 h | Faible |
| Tester sur device avec changement de locale système | S — 30 min | Faible |
| **Sous-total technique** | **~1-1.5 jour focus** | |

### Charge non-technique

| Tâche | Effort | Risque |
|---|---|---|
| Génération TTS de 76 audios EN | M — 4 h | Moyen (qualité voix) |
| QA d'écoute des 76 audios | M — 3-4 h | Élevé (idéalement natif EN) |
| Politique de confidentialité EN (si pas déjà) | S à M | Moyen (légal) |
| Audit COPPA/GDPR-K (si distribution US/élargie) | L | **Élevé** |
| Mise à jour fiche Play Store EN (textes, screenshots) | M — 3-4 h | Faible |
| Validation native du vocabulaire enfant 3 ans | S — 1-2 h | Moyen |

### Verdict

- **Complexité technique** : **faible à moyenne**. ~1-1.5 jour de dev. Le code est petit (14 strings, 27 labels), bien structuré (les clés enum sont déjà en EN), et l'audio est centralisé. Le seul vrai piège technique est la **restructuration des templates de phrase** qui force un refactor des labels (article séparé, singulier/pluriel).
- **Complexité audio** : **moyenne**. TTS rend la génération rapide, mais la QA d'écoute (76 clips × validation native) reste un effort sérieux. C'est le chemin critique pour shipper.
- **Complexité légale/store** : **variable, potentiellement le vrai blocage**. Si tu vises juste UK/Australie/Canada anglo (zones avec règles proches de l'EU), c'est gérable. Si US sérieux est dans la roadmap, COPPA mérite un vrai audit. Sans réponse claire à "où veux-tu distribuer ?", l'estimation reste ouverte.

**Recommandation** : avant de coder, clarifier le **scope de distribution géographique** (UK seul ? US ? monde anglophone ?), car cela conditionne plus de travail que l'i18n elle-même. La partie code est presque triviale relativement.

## Fichiers concernés (pour référence future)

- `src/screens/menu/MainMenu.tsx` — bouton JOUER
- `src/screens/menu/GameSelectionMenu.tsx` — titre + 4 boutons + 3 `questionConfig` (animal/couleur/forme)
- `src/screens/game/FindGame.tsx` — "Trouve {label}" + "Question X sur N"
- `src/screens/game/NumberGame.tsx` — `animalSoundMap` (labels "de canards") + "Combien comptes-tu" + "Question X sur N"
- `src/screens/game/result-modal.tsx` — BRAVO/FAUX + "La bonne réponse" + bouton SUIVANT
- `src/screens/score/index.tsx` — 3 messages de score + "Résultat :" + bouton REJOUER
- `src/store/audio.ts` — 76 `require(...)` à dupliquer par locale, structure `SOUNDS*`
- `assets/audio/*.mp3` — 76 fichiers à déplacer dans `fr/`, miroir à créer dans `en/`
- `app.json` — RAS (nom universel)
- `package.json` — ajouter `expo-localization`

## Questions ouvertes à trancher avant implémentation

1. **Scope de distribution géographique** (UK seul ? US ? monde anglophone ?) → conditionne l'effort légal
2. **Filet de sécurité parental** (geste caché pour switch de langue) → utile si auto-détection rate sur certains devices
3. **Variante régionale du français** (FR-FR uniquement, ou FR-CA compatible ?)
4. **Choix lexicaux EN à valider** : `diamond`/`rhombus` pour losange, ton de BRAVO/FAUX, "Find"/"Tap"/"Show me"
5. **Validation native** : qui écoute les 76 audios EN avant publication ?
6. **iOS dans le scope ou pas** ?