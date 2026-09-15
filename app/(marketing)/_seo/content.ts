export type LandingPage = {
  slug: string; label: string; title: string; description: string; h1: string;
  intro: string; fit: string; sections: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  articles: { slug: string; label: string }[];
  comparison?: { caption: string; headers: string[]; rows: string[][]; source: string; sourceLabel: string };
  contact?: boolean;
};

export const landingPages: LandingPage[] = [
  {
    slug: 'podcast-mastering', label: 'Podcast mastering',
    title: 'Podcast Mastering Online — Try PodMaster | Saltwaves',
    description: 'Finish your spoken-word recording with noise reduction, EQ and loudness processing. Try PodMaster, then check your master with our free loudness tool.',
    h1: 'Podcast mastering. Your episode, finished.',
    intro: 'Podcast mastering is the final audio pass: reducing distracting noise, balancing tone and setting the finished level. PodMaster brings those jobs into one upload, with a chain built by an engineer with 20 years in broadcast and live sound.',
    fit: 'A solo host, narrator or consistent single-mic recording is the best starting point. Upload WAV, MP3 or M4A and get the master by email.',
    sections: [
      { title: 'Start with the voice. Finish with the level.', text: 'A recording can hit a loudness target and still be tiring to hear. Noise distracts between sentences; an uneven tonal balance can make speech feel thin or heavy. PodMaster combines noise reduction, EQ balance and loudness processing so you can evaluate the finished sound as a whole.' },
      { title: 'Keep the edit in your hands.', text: 'Choose the takes, remove mistakes and arrange the episode before your final delivery check. For the mastering input, keep the audio free of added noise reduction, EQ or heavy compression. PodMaster processes one file end to end; it does not make editorial decisions or assemble a multitrack interview.' },
      { title: 'One file does not mean one-size-fits-all audio.', text: 'A guest recorded on a laptop and a host on a studio microphone may need different treatment. When you have separate recordings, keep them separate for individual work, then check the final mix. If the episode needs detailed speaker balancing, music editing or repair, talk to Saltwaves about post-production.' },
      { title: 'Check the file you actually publish.', text: 'Listen to a quiet passage, an energetic passage and transitions into music. Measure the final export with the Loudness Checker and compare it with your destination’s specification. A passing meter is a useful check, but your ears still decide whether the episode is ready.' },
    ],
    faqs: [
      { question: 'Is podcast mastering the same as turning up the volume?', answer: 'No. Raising gain changes the overall level, including noise and peaks. Mastering also considers tone, noise and dynamics before checking the final loudness.' },
      { question: 'Can I try PodMaster before paying?', answer: 'Yes. The Free plan needs no account. Check the current pricing page for processing allowances and file limits, then upload your own recording to compare the result.' },
      { question: 'Does PodMaster publish my podcast?', answer: 'No. You receive the mastered audio by email. Download and review it, then upload it to your podcast host. Download links are available for 48 hours.' },
    ],
    articles: [{ slug: 'how-loud-should-a-podcast-be-lufs-guide', label: 'How loud should a podcast be?' }, { slug: 'why-your-podcast-sounds-bad', label: 'Why your podcast sounds bad' }],
  },
  {
    slug: 'auphonic-alternative', label: 'Auphonic alternative',
    title: 'Auphonic Alternative for Spoken Word — PodMaster | Saltwaves',
    description: 'Compare PodMaster and Auphonic by workflow: single-file spoken-word mastering, multitrack production and integrations. Try your own recording in PodMaster.',
    h1: 'An Auphonic alternative. Hear what fits your show.',
    intro: 'Looking for an Auphonic alternative for a solo podcast or narration? PodMaster offers a focused upload-to-master workflow, combining noise reduction, EQ balance and loudness processing. Compare the result on your own voice before changing your production routine.',
    fit: 'Choose by the job you need done: a finished spoken-word file, a multitrack mix, or an automated publishing workflow.',
    comparison: {
      caption: 'PodMaster and Auphonic: workflow comparison', headers: ['Your workflow', 'PodMaster', 'Auphonic'],
      rows: [
        ['Clean and finish spoken word', 'Noise reduction, EQ and loudness in one upload', 'Noise and reverb reduction, AutoEQ and loudness tools'],
        ['Several microphones or speakers', 'One file processed with one set of decisions', 'Dedicated multitrack processing and mixdown'],
        ['Receive the result', 'Master delivered by email', 'File export and publishing integrations'],
        ['Build an integration', 'Contact Saltwaves to discuss availability and scope', 'Documented developer API and workflow integrations'],
      ], source: 'https://auphonic.com/features', sourceLabel: 'Auphonic’s official feature list',
    },
    sections: [
      { title: 'Start with one representative recording.', text: 'Use a file with normal speech, a quieter section and the background noise you usually record. Submit the same original to each service. Compare at similar playback levels so that a louder result does not automatically feel better. Listen for consonants, breaths and the ends of sentences.' },
      { title: 'Where PodMaster fits.', text: 'If you record a consistent voice source and want a finished file without building a processing preset, PodMaster is worth auditioning. The chain reflects Marcus Bornold’s broadcast and live-sound experience. That is a reason to listen, not a promise that it will win on every recording.' },
      { title: 'When the wider workflow matters.', text: 'Auphonic documents multitrack processing, publishing connections and an API. If those are central to your production, include them in your decision. PodMaster’s public upload flow works on one file; do not assume it replaces a multitrack production system.' },
    ],
    faqs: [
      { question: 'Does Auphonic only normalize loudness?', answer: 'No. Auphonic also documents noise and reverb reduction, EQ, multitrack processing and other production features. Compare the complete workflow and the sound on your recording.' },
      { question: 'Is PodMaster better for every podcast?', answer: 'There is no universal winner. PodMaster is built for consistent spoken-word sources. Try the same original file and compare the results at similar listening levels.' },
      { question: 'Can I move my Auphonic presets to PodMaster?', answer: 'There is no preset import in PodMaster’s public upload flow. Start with your original recording and evaluate the delivered master.' },
    ],
    articles: [{ slug: 'auphonic-alternative-podcast-audio', label: 'The room, the voice and automated processing' }, { slug: 'how-loud-should-a-podcast-be-lufs-guide', label: 'Compare loudness without chasing a number' }],
  },
  {
    slug: 'adobe-podcast-alternative', label: 'Adobe Podcast alternative',
    title: 'Adobe Podcast Alternative for Mastering — PodMaster | Saltwaves',
    description: 'Need a finished podcast master? Compare Adobe Enhance Speech and PodMaster by the task, audition your original recording and check the final loudness.',
    h1: 'An Adobe Podcast alternative for the finished episode.',
    intro: 'If your next step is a mastered spoken-word file, try PodMaster on your original recording. It combines noise reduction, EQ balance and loudness processing, with the result delivered by email.',
    fit: 'This comparison concerns Adobe Podcast Enhance Speech. Adobe’s wider recording and editing products offer different workflows.',
    comparison: {
      caption: 'Enhance Speech and PodMaster: choose your next step', headers: ['What you need', 'PodMaster', 'Adobe Enhance Speech'],
      rows: [
        ['Work on a spoken recording', 'Single-file cleanup and mastering', 'Speech enhancement for clearer dialogue'],
        ['Reduce distracting background sound', 'Noise reduction in the mastering chain', 'Noise and reverb reduction with enhancement controls'],
        ['Check delivery loudness', 'Loudness processing; verify the final export', 'Measure the enhanced export against your delivery target'],
        ['Decide what sounds right', 'Audition your own master', 'Audition the enhancement and available strength controls'],
      ], source: 'https://podcast.adobe.com/en/guides/what-is-enhance-speech', sourceLabel: 'Adobe’s Enhance Speech guide',
    },
    sections: [
      { title: 'Clarity is the first listening test.', text: 'Listen to the words before the meter. Are quiet syllables intact? Does the voice still feel natural? Is the background less distracting? Speech enhancement can help with a difficult source, but the right amount of processing depends on the recording. Keep an untouched original so you can compare.' },
      { title: 'The finished episode needs a delivery check.', text: 'An improvement in clarity does not tell you the integrated loudness or true peak of the exported file. Measure the file you intend to publish, including any intro, outro or later edits. Our free Loudness Checker runs in your browser and helps you understand those measurements.' },
      { title: 'Compare original-to-result, not processor-on-processor.', text: 'For a useful PodMaster trial, upload the original rather than a file that has already been heavily enhanced. Repeated processing can make it harder to judge where a change came from. Compare both outputs at similar listening levels, then choose the workflow that leaves you with less finishing work.' },
    ],
    faqs: [
      { question: 'Should I run Adobe Enhance Speech before PodMaster?', answer: 'Start with the untouched original for your PodMaster trial. That gives the chain a clean starting point and lets you compare the two results fairly.' },
      { question: 'Does this comparison cover Adobe Audition?', answer: 'No. It covers the Enhance Speech web tool. Adobe Audition is a separate editing and mixing application with its own processing tools.' },
      { question: 'Can PodMaster guarantee a natural result on damaged audio?', answer: 'No. Clipping, missing speech and severe room sound can limit what processing can achieve. Audition the result; use post-production help when a recording needs individual repair.' },
    ],
    articles: [{ slug: 'adobe-podcast-alternative', label: 'From speech enhancement to the finished episode' }, { slug: 'how-to-remove-echo-from-podcast-recording', label: 'What to do about room echo' }],
  },
  {
    slug: 'podcast-audio-cleanup', label: 'Podcast audio cleanup',
    title: 'Podcast Audio Cleanup and Mastering — PodMaster | Saltwaves',
    description: 'Clean up a spoken-word recording with PodMaster. Understand noise, room sound and repair limits, then upload your original and check the finished master.',
    h1: 'Podcast audio cleanup. Let the voice come through.',
    intro: 'Podcast audio cleanup reduces distractions around the voice. PodMaster combines noise reduction with EQ balance and loudness processing, so you can audition a finished master from a single upload.',
    fit: 'Start with the original WAV, MP3 or M4A. A consistent solo voice or single microphone gives the chain the clearest job.',
    sections: [
      { title: 'A steady hiss or hum.', text: 'Listen in the gaps between phrases. Fans, ventilation and microphone noise can mask quieter words, especially after the episode is turned up. Noise reduction is part of PodMaster’s processing, but judge the whole phrase as well as the silence: a quieter background is only useful if the speech holds up.' },
      { title: 'A voice that sounds distant or hollow.', text: 'Room reflections overlap the speech itself. That makes echo a different problem from steady background noise. Try a representative recording and listen to word endings and pauses. For future sessions, get closer to the microphone and reduce reflections; a heavily reverberant source may still need individual post-production work.' },
      { title: 'Distortion, missing words or overlapping speakers.', text: 'These are repair and editing problems as well as cleanup problems. No upload workflow can promise to recover information that was not captured. Keep separate speaker tracks where possible, replace a damaged take when you can, and ask for a human review if the recording is important and the result is still unclear.' },
      { title: 'Clean first. Check the final episode.', text: 'Keep a copy of the original and avoid stacking aggressive processing before your trial. Listen to the returned master on headphones and your usual playback device. If you add music or make further edits, measure that final export again: cleanup alone does not certify delivery compliance.' },
    ],
    faqs: [
      { question: 'Can PodMaster remove every background sound?', answer: 'No. Results depend on how the noise overlaps the speech and how the source was recorded. Listen to the master before publishing, especially quiet phrases and word endings.' },
      { question: 'Will cleanup fix an interview with unequal microphones?', answer: 'One file receives one set of processing decisions. Different speakers and rooms may need separate treatment before mixing; a single upload is not a substitute for that control.' },
      { question: 'Can I check my recording without uploading it?', answer: 'Yes. The free Loudness Checker analyzes level and true peak locally in your browser. It measures the file; it does not clean or master it.' },
    ],
    articles: [{ slug: 'how-to-remove-echo-from-podcast-recording', label: 'How to remove echo from a podcast recording' }, { slug: 'why-your-podcast-sounds-bad', label: 'Before you buy another microphone' }],
  },
  {
    slug: 'podcast-mastering-api', label: 'Podcast mastering API', contact: true,
    title: 'Podcast Mastering API Enquiries — Saltwaves PodMaster',
    description: 'Discuss podcast mastering integration with Saltwaves. Share your file volumes, delivery needs and workflow. API access and scope are confirmed individually.',
    h1: 'Podcast mastering API. Start with your workflow.',
    intro: 'Want to bring podcast mastering into your production system? Talk to Saltwaves about the files you process and where the results need to go. This is an integration enquiry: API access, supported features and commercial terms must be confirmed before you build.',
    fit: 'The public PodMaster upload tool is available now for evaluating sound. This page does not offer API keys or a self-service developer plan.',
    sections: [
      { title: 'Tell us what a normal week looks like.', text: 'Include the number of episodes, typical and maximum duration, file formats and whether each file contains one voice or a finished mix. Describe peaks in demand as well as average volume. This helps establish whether your workload fits the processing workflow.' },
      { title: 'Describe the handoff you need.', text: 'Explain where the source files live, how a job should start and where completed audio should arrive. Flag any need for job status, callbacks, retries or batch handling. These are requirements to discuss, not features promised by this page.' },
      { title: 'Agree delivery and data requirements first.', text: 'Share your destination’s audio specification, turnaround expectations and data-handling requirements. Authentication, limits, retention, support and pricing need an agreed scope. Do not base a production integration on internal endpoints used by the website.' },
      { title: 'Evaluate the sound before the integration.', text: 'Try representative, non-sensitive material through the public PodMaster tool and review the result with your production team. Listen to the voice and check the exported measurements. If the job needs editing or an engineer’s attention, Saltwaves post-production may be the more suitable starting point.' },
    ],
    faqs: [
      { question: 'Is there a public self-service PodMaster API?', answer: 'This page offers an integration enquiry, not self-service API access. Contact Saltwaves to confirm current availability and agree a scope before starting development.' },
      { question: 'Does a PodMaster subscription include API access?', answer: 'Do not assume API access is included in a website subscription. Integration access and commercial terms must be confirmed separately with Saltwaves.' },
      { question: 'What should I include in my enquiry?', answer: 'Describe your organisation, monthly audio volume, file types, deadlines, delivery targets and how you want to submit and receive files. Mention security, retention and support requirements.' },
    ],
    articles: [{ slug: 'how-loud-should-a-podcast-be-lufs-guide', label: 'Define the delivery target' }],
  },
];

export function getLandingPage(slug: string) {
  const page = landingPages.find((page) => page.slug === slug);
  if (!page) throw new Error(`Unknown landing page: ${slug}`);
  return page;
}
