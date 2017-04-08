insert into i18n.locale(locale_id) VALUES ('fr');
insert into i18n.locale(locale_id) VALUES ('en');

COPY i18n.key (key_id) FROM STDIN WITH (delimiter ',', FORMAT csv, ENCODING 'utf-8', FREEZE ON);
admin.monitoring.card.delete.confirm
admin.monitoring.card.edit.cancel
admin.monitoring.card.create
admin.monitoring.card.save
admin.monitoring.card.delete
admin.monitoring.card.variables.firstLine
admin.monitoring.card.variables.secondLine
admin.monitoring.card.view.askQuestion.title.text
admin.monitoring.card.view.sendText.title.text
admin.monitoring.card.view.transfer.url.title.text
admin.monitoring.card.view.transfer.distributionRule.title.text
admin.monitoring.card.display.transfer.distributionRule.to
admin.monitoring.card.display.askQuestion.saveResponseAs
admin.monitoring.card.edit.askQuestion.title.text
admin.monitoring.card.edit.askQuestion.question.label
admin.monitoring.card.edit.askQuestion.question.placeholder
admin.monitoring.card.edit.askQuestion.simple.title
admin.monitoring.card.edit.askQuestion.simple.label
admin.monitoring.card.edit.askQuestion.multiple.title
admin.monitoring.card.edit.askQuestion.multiple.label
admin.monitoring.card.edit.askQuestion.multiple.choices.some.placeholder
admin.monitoring.card.edit.askQuestion.multiple.choices.none.placeholder
admin.monitoring.card.edit.askQuestion.multiple.choices.some.delete.confirmation
admin.monitoring.card.edit.sendText.title.text
admin.monitoring.card.edit.sendText.text.label
admin.monitoring.card.edit.sendText.text.placeholder
admin.monitoring.card.edit.transfer.distributionRule.title.text
admin.monitoring.card.edit.transfer.distributionRule.label
admin.monitoring.card.edit.transfer.distributionRule.placeholder
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.title
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.toggle.label
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.toggle.label
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.text.placeholder
admin.monitoring.card.edit.transfer.url.title.text
admin.monitoring.card.edit.transfer.url.label
admin.monitoring.card.edit.transfer.url.placeholder
admin.monitoring.scenario.options.cancel
admin.monitoring.scenario.options.save
admin.monitoring.scenario.options.isAvailableIfOnlyOperatorAreAvailable.label
\.

-- add some fr translation
-- npm run --silent wti-extract-keys | jq 'toPairs | map(([k, v]) => [k.replace("bot.editor", "monitoring"), "fr", "Active", "{"+JSON.stringify(v)+"}"]) | join("\n")'
COPY i18n.segment (key_id, locale_id, status, segment) FROM STDIN WITH (delimiter ',', FORMAT csv, ENCODING 'utf-8', FREEZE ON);
admin.monitoring.card.delete.confirm,fr,Active,{"Etes-vous sûr de vouloir supprimer cette carte et toutes les cartes qui la suivent ?"}
admin.monitoring.card.edit.cancel,fr,WaitingTranslation,{"Cancel"}
admin.monitoring.card.create,fr,WaitingTranslation,{"Create card"}
admin.monitoring.card.save,fr,WaitingTranslation,{"Save card"}
admin.monitoring.card.delete,fr,WaitingTranslation,{"Delete this card"}
admin.monitoring.card.variables.secondLine,fr,WaitingTranslation,{"Links will automatically be clickable."}
admin.monitoring.card.view.askQuestion.title.text,fr,WaitingTranslation,{"Ask a question"}
admin.monitoring.card.view.sendText.title.text,fr,WaitingTranslation,{"Send a text"}
admin.monitoring.card.view.transfer.url.title.text,fr,WaitingTranslation,{"Open a page"}
admin.monitoring.card.view.transfer.distributionRule.title.text,fr,WaitingTranslation,{"Transfert to a distribution rule"}
admin.monitoring.card.display.transfer.distributionRule.to,fr,WaitingTranslation,{"Transfert to"}
admin.monitoring.card.display.askQuestion.saveResponseAs,fr,WaitingTranslation,{"Save data as"}
admin.monitoring.card.edit.askQuestion.title.text,fr,WaitingTranslation,{"Ask a question"}
admin.monitoring.card.edit.askQuestion.question.label,fr,WaitingTranslation,{"Your bot asks"}
admin.monitoring.card.edit.askQuestion.question.placeholder,fr,WaitingTranslation,{"Write your text here"}
admin.monitoring.card.edit.askQuestion.simple.title,fr,WaitingTranslation,{"Wait for an answer"}
admin.monitoring.card.edit.askQuestion.simple.label,fr,WaitingTranslation,{"Save data as"}
admin.monitoring.card.edit.askQuestion.multiple.title,fr,WaitingTranslation,{"Propose multiple choice"}
admin.monitoring.card.edit.askQuestion.multiple.label,fr,WaitingTranslation,{"Separate choices with a comma"}
admin.monitoring.card.edit.askQuestion.multiple.choices.some.placeholder,fr,WaitingTranslation,{"Add a choice"}
admin.monitoring.card.edit.askQuestion.multiple.choices.none.placeholder,fr,WaitingTranslation,{"Type your first choice"}
admin.monitoring.card.edit.askQuestion.multiple.choices.some.delete.confirmation,fr,Active,{"Etes-vous sûr de vouloir supprimer le choix %s et toutes les cartes qui le suivent ?"}
admin.monitoring.card.edit.sendText.title.text,fr,WaitingTranslation,{"Send a text"}
admin.monitoring.card.edit.sendText.text.label,fr,WaitingTranslation,{"Text (less than 320 chars)"}
admin.monitoring.card.edit.sendText.text.placeholder,fr,WaitingTranslation,{"Write your text here"}
admin.monitoring.card.edit.transfer.distributionRule.title.text,fr,WaitingTranslation,{"Transfer to a human"}
admin.monitoring.card.edit.transfer.distributionRule.label,fr,WaitingTranslation,{"Send the visitor to this distribution group"}
admin.monitoring.card.edit.transfer.distributionRule.placeholder,fr,WaitingTranslation,{"Search a distribution group"}
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.title,fr,WaitingTranslation,{"If transfer fails"}
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.toggle.label,fr,WaitingTranslation,{"Retry 5 times and close the conversation"}
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.toggle.label,fr,WaitingTranslation,{"Send this message and close the conversation"}
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.text.placeholder,fr,WaitingTranslation,{"Write your message, you can use links and variables"}
admin.monitoring.card.edit.transfer.url.title.text,fr,WaitingTranslation,{"Open a page"}
admin.monitoring.card.edit.transfer.url.label,fr,WaitingTranslation,{"Link"}
admin.monitoring.card.edit.transfer.url.placeholder,fr,WaitingTranslation,{"Paste the link here"}
admin.monitoring.scenario.options.cancel,fr,WaitingTranslation,{"Quit editing"}
admin.monitoring.scenario.options.save,fr,WaitingTranslation,{"Save"}
admin.monitoring.scenario.options.isAvailableIfOnlyOperatorAreAvailable.label,fr,WaitingTranslation,{"Enable the bot when no agents are available"}
\.

-- add some en  translation
COPY i18n.segment (key_id, locale_id, status, segment) FROM STDIN WITH (delimiter ',', FORMAT csv, ENCODING 'utf-8', FREEZE ON);
admin.monitoring.card.delete.confirm,en,Active,{"Etes-vous sûr de vouloir supprimer cette carte et toutes les cartes qui la suivent ?"}
admin.monitoring.card.edit.cancel,en,Active,{"Cancel"}
admin.monitoring.card.create,en,Active,{"Create card"}
admin.monitoring.card.save,en,Active,{"Save card"}
admin.monitoring.card.delete,en,Active,{"Delete this card"}
admin.monitoring.card.variables.secondLine,en,Active,{"Links will automatically be clickable."}
admin.monitoring.card.view.askQuestion.title.text,en,Active,{"Ask a question"}
admin.monitoring.card.view.sendText.title.text,en,Active,{"Send a text"}
admin.monitoring.card.view.transfer.url.title.text,en,Active,{"Open a page"}
admin.monitoring.card.view.transfer.distributionRule.title.text,en,Active,{"Transfert to a distribution rule"}
admin.monitoring.card.display.transfer.distributionRule.to,en,Active,{"Transfert to"}
admin.monitoring.card.display.askQuestion.saveResponseAs,en,Active,{"Save data as"}
admin.monitoring.card.edit.askQuestion.title.text,en,Active,{"Ask a question"}
admin.monitoring.card.edit.askQuestion.question.placeholder,en,Active,{"Write your text here"}
admin.monitoring.card.edit.askQuestion.simple.title,en,Active,{"Wait for an answer"}
admin.monitoring.card.edit.askQuestion.simple.label,en,Active,{"Save data as"}
admin.monitoring.card.edit.askQuestion.multiple.title,en,Active,{"Propose multiple choice"}
admin.monitoring.card.edit.askQuestion.multiple.label,en,Active,{"Separate choices with a comma"}
admin.monitoring.card.edit.askQuestion.multiple.choices.some.placeholder,en,Active,{"Add a choice"}
admin.monitoring.card.edit.askQuestion.multiple.choices.none.placeholder,en,Active,{"Type your first choice"}
admin.monitoring.card.edit.askQuestion.multiple.choices.some.delete.confirmation,en,Active,{"Etes-vous sûr de vouloir supprimer le choix %s et toutes les cartes qui le suivent ?"}
admin.monitoring.card.edit.sendText.title.text,en,Active,{"Send a text"}
admin.monitoring.card.edit.sendText.text.label,en,Active,{"Text (less than 320 chars)"}
admin.monitoring.card.edit.sendText.text.placeholder,en,Active,{"Write your text here"}
admin.monitoring.card.edit.transfer.distributionRule.title.text,en,Active,{"Transfer to a human"}
admin.monitoring.card.edit.transfer.distributionRule.label,en,Active,{"Send the visitor to this distribution group"}
admin.monitoring.card.edit.transfer.distributionRule.placeholder,en,Active,{"Search a distribution group"}
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.title,en,Active,{"If transfer fails"}
admin.monitoring.card.edit.transfer.distributionRule.ifTransferFail.toggle.label,en,Active,{"Retry 5 times and close the conversation"}
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.toggle.label,en,Active,{"Send this message and close the conversation"}
admin.monitoring.card.edit.transfer.distributionRule.sendMessage.text.placeholder,en,Active,{"Write your message, you can use links and variables"}
admin.monitoring.card.edit.transfer.url.title.text,en,Active,{"Open a page"}
admin.monitoring.card.edit.transfer.url.label,en,Active,{"Link"}
admin.monitoring.card.edit.transfer.url.placeholder,en,Active,{"Paste the link here"}
admin.monitoring.scenario.options.cancel,en,Active,{"Quit editing"}
admin.monitoring.scenario.options.save,en,Active,{"Save"}
admin.monitoring.scenario.options.isAvailableIfOnlyOperatorAreAvailable.label,en,Active,{"Enable the bot when no agents are available"}
\.

-- key_id util.citext NOT NULL REFERENCES i18n.key(key_id) ON DELETE CASCADE ON UPDATE CASCADE,
-- locale_id CHAR(2) NOT NULL REFERENCES i18n.locale(locale_id) ON DELETE CASCADE ON UPDATE CASCADE,
-- status VarCHAR(25) NOT NULL REFERENCES i18n."segmentStatus"("segmentStatus_id") ON DELETE CASCADE ON UPDATE CASCADE,
-- segment TEXT[] NOT NULL,
