#!/usr/bin/env node
// trilium sublimetext handler
//*
const {req, res} = api;
const {secret, content} = req.body;
//*/
/*
const {res} = api;
const req = {method: 'POST'};
const secret =  'portfolio-burger-grand';
const title = 'code';
let content = 'new';
/*/

const PREFIX = 'sublime_'
const SECRET = '<put your secret here>

if (req.method == 'POST' && secret === SECRET) {
    const todayNote = api.getDayNote(api.dayjs().format("YYYY-MM-DD"));
    let newNote;
    let noteContent = content;
    let shebang;
    let title;
    const lines = content.split("\n");
    const firstline = lines[0];
    if (firstline.startsWith('#!')) {
        shebang = lines.shift();
        title = lines[0];
        noteContent = lines.join("\n");
    } else {
        title = firstline;
    }
    
    const childNotes = todayNote.getChildNotes();
    const sameTitleNotes = childNotes.filter(element => element.title === title);
    if (sameTitleNotes.length > 0) {
        newNote = sameTitleNotes[0];
        newNote.setContent(noteContent);
        newNote.save();
    }
    if (newNote === undefined) {
        let type;
        let mime;
        let label;
        if (title === 'mindmap') {
            type = 'mermaid';
            label = PREFIX+'mindmap';
        } else if (shebang.endsWith('python3') || shebang.endsWith('python')) {
            type = 'code';
            mime = 'text/x-python';
        } else if (shebang.endsWith('node')) {
            type = 'code';
            mime = 'application/javascript;env=backend';
        } else if (shebang.endsWith('bash')) {
            type = 'code';
            mime = 'text/x-sh';
        } else {
            noteContent = noteContent.replace(/%0A/g, "<br>");
            type = 'text';
        }
        if (!label) label = PREFIX+type;
        params = {
            parentNoteId: todayNote.noteId,
            title,
            content: noteContent,
            type,
        };
        if (mime) params.mime = mime;
        const {note} = api.createNewNote(params);
        newNote = note;
        if (label) newNote.setLabel(label);
        newNote.setLabel('sublimetext');
    }
    const notePojo = newNote.getPojo();

    res.status(201).json(notePojo);
}
else {
    res.send(400);
}
