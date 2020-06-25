import * as CodeMirror from 'codemirror';
import 'codemirror/mode/python/python';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/wrap/hardwrap';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/selection/active-line';
import 'codemirror/keymap/sublime';


import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';

import '../lib/codemirror-lsp.css';
import { LspWsConnection, CodeMirrorAdapter } from '../lib/index';


const theme = 'idea', keymap = 'sublime';
var Configs = {
    lineNumbers: true,
    smartIndent: true,
    mode: 'python',
    styleActiveLine: true,
    autofocus: true,
    theme: theme,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lsp"],
    keyMap: keymap
  };

var myTextArea = document.getElementById('code') as HTMLTextAreaElement;
var codeEditor = CodeMirror.fromTextArea(myTextArea, Configs);

function connectToLangServer (language_server_path: string, filename: string): void
{
    if(!language_server_path.startsWith('ws://')) {
      if (window.location.port)
        language_server_path = `ws://${window.location.hostname}:${window.location.port}${language_server_path}`
      else {
        language_server_path = `ws://${window.location.hostname}${language_server_path}`
      }
    }
    let py  = {
      serverUri: language_server_path,
      languageId: 'python',
      rootUri: 'file:///',
      documentUri: 'file:///' + filename,
      documentText: () => codeEditor.getValue()
    };


    let pyConnection = new LspWsConnection(py).connect(new WebSocket(py.serverUri));
    let pyAdapter = new CodeMirrorAdapter(pyConnection, {
      quickSuggestionsDelay: 200,
    }, codeEditor);

}

export {codeEditor};
export {connectToLangServer};

