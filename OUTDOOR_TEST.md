# Sidequest: Outdoor Field Test Protocol & Status

---

## 1. Current Testing Status

> [!NOTE]
> **Controlled Lab & Synthetic Benchmarks: COMPLETED (PASS)**  
> **Outdoor Field Trial: PROTOCOL DEFINED & READY FOR PILOTING**

The automated vision pipeline, camera capture module, and contrastive margin verifier have been evaluated in controlled environments using calibrated nature and distractor imagery (see [AI_EVALUATION.md](AI_EVALUATION.md)). 

In keeping with the hackathon's honesty requirements, **an extensive multi-participant outdoor field study with children has not yet been conducted**. Below is the verified, child-safe protocol designed for supervised field testing.

---

## 2. Supervised Field Test Protocol

### 2.1 Participant & Equipment Prerequisites
* **Supervising Adults**: At least 1 adult per 2 children (ages 5–12).
* **Device**: Mobile smartphone (iOS Safari 16+ or Android Chrome 110+) running Sidequest PWA.
* **Preparation**:
  1. Open Sidequest while connected to home Wi-Fi.
  2. Tap "Prepare Offline Before Leaving Home".
  3. Verify that the vision model (~85 MB) reaches 100% and displays the green "Ready Offline" badge.
  4. Enable Airplane Mode to verify full offline independence before departing.

### 2.2 Safety & Environmental Ground Rules
Before beginning the scavenger hunt, the supervising adult must brief children:
1. **The Buddy Rule**: Stay within arm’s reach of the supervising adult at all times.
2. **Look, Don't Touch**: Never touch or ingest wild mushrooms, unknown berries, stinging nettles, or wild insects.
3. **Terrain Awareness**: Avoid steep trail drop-offs, slippery river rocks, and active roadways.
4. **No Wildlife Harassment**: Maintain distance from birds, squirrels, and insects; capture photographs from a respectful distance.
5. **Leave No Trace**: Do not break living branches or pick living wildflowers.

### 2.3 Field Test Procedure (Walkthrough)

| Phase | Duration | Objective | Child Action | Expected App Response |
| :--- | :--- | :--- | :--- | :--- |
| **Stop 1** | ~4 min | Rough Tree Bark | Spots a mature tree trunk, steps close, frames bark texture | The Blaze fills to 100% (Green `MATCH`). Haptic tick sounds. Educational Field Note on tree bark appears. |
| **Stop 2** | ~5 min | Green Leaf Veins | Finds a living green leaf, holds it steady without plucking | Camera auto-focuses. Verification confirms leaf venation (`MATCH`). |
| **Stop 3** | ~4 min | Smooth Pebble | Picks up a river rock or garden pebble | Model detects smooth rock texture (`MATCH`). Parent reminds child to return pebble to soil. |
| **Stop 4** | ~5 min | Green Moss | Locates shaded moss on north side of a boulder | If lighting is dim, The Blaze indicates `UNCERTAIN` or prompts child to angle toward daylight. Parent may use "Count it!" override if desired. |
| **Stop 5** | ~3 min | Fallen Petal | Finds a colorful petal on garden lawn | The Blaze fills to 100% (`MATCH`). Hunt automatically concludes. |
| **Debrief** | ~3 min | Field Journal | Children review the private Keepsake field journal | Phone is placed away; family enjoys the remainder of the walk. |

---

## 3. Observational Metrics to Record
During field trials, supervising adults should record:
1. **Screen-to-Nature Ratio**: The proportion of time children spent looking at the natural world versus looking at the smartphone screen (target: < 20% screen time).
2. **First-Shot Match Rate**: Percentage of clues successfully verified on the initial camera capture.
3. **Parent Override Frequency**: Number of times the "Count it!" override was needed due to difficult outdoor lighting or shadowed angles.
4. **Child Engagement**: Qualitative reactions to the educational field notes and the signature Blaze trail marker.
