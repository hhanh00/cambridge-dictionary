import cheerio from 'cheerio';

export function parseSenseHTML(html) {
  const $ = cheerio.load(html);
  const $dataRoot = $('.entry');

  return $dataRoot.find('.entry-body__el').map((i, entry) => {
    const $entry = $(entry);
    return {
      pos: $entry.find('.posgram').text(),
      senses: $entry.find('.dsense').map((j, sense) => {
        const $sense = $(sense);
        return {
          guideWord: $sense.find('.guideword').children().first().text(),
          definitions: $sense.find('.def-block').map((k, defBlock) => {
            const $defBlock = $(defBlock);
            const $defHead = $defBlock.find('.ddef_h');
            const $defBody = $defBlock.find('.ddef_b');
            return {
              text: clearRedendentSpaces($defHead.find('.def').text()),
              examples: $defBody.find('.examp')
                .map((l, example) => $(example).text()).get()
                .map(text => text.trim())
                .map(clearRedendentSpaces),
            };
          }).get(),
        };
      }).get(),
    };
  }).get();
}

function clearRedendentSpaces(text = '') {
  return text.replace(/[\s\n|\t]+/g, ' ');
}

export default {};
