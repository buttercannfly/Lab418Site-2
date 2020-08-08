import React from 'react';
import { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Layout, Input, Button, message } from 'antd';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';
import '../styles/docEditor.css'
import { mockClient } from '../client';
const { Header } = Layout;

export default class DocEditor extends Component {
    constructor(props) {
        super(props);
        const passedState = this.props.location ? this.props.location.state : null;
        const doc = passedState ? passedState.doc : null;

        this.tempContent = doc ? doc.paragraph : null;
        this.state = {
            editorContent: doc ? doc.paragraph : null,
            inputTitle: doc ? doc.title : null,
            typeUpdating: doc ? true : false,
        };
        this.onEditorTextChange = this.onEditorTextChange.bind(this);
        this.onInputTitleTextChange = this.onInputTitleTextChange.bind(this);
        this.updateDoc = this.updateDoc.bind(this);
        this.addDoc = this.addDoc.bind(this);
    }

    onEditorTextChange(editor, data, value) {
        this.setState({ editorContent: value });
    }

    onInputTitleTextChange(ev) {
        this.setState({ inputTitle: ev.target.value });
    }

    addDoc() { }

    updateDoc() {
        mockClient.updateDoc(this.state.inputTitle, this.state.editorContent)
            .then(resp => {
                console.log(resp);
                message.info("更新成功");
                // todo go back here
            })
            .catch(v => {
                console.log(v);
                message.error("更新失败");
            });
    }

    cancelUpdate() {
        // todo go back here
    }

    render() {
        var buttonText = "添加";
        if (this.state.typeUpdating) buttonText = "更新";

        return <Layout className="doc-editor">
            <Header className="editor-header header">
                <Input onChange={this.onInputTitleTextChange} placeholder="标题" className="editor-title-input" value={this.state.inputTitle} />
                <Button
                    onClick={this.state.typeUpdating ? this.updateDoc : this.addDoc}
                    type="primary"
                    className="editor-button">
                    {buttonText}
                </Button>
                {this.state.typeUpdating ?
                    <Button
                        onClick={this.cancelUpdate}
                        type="primary"
                        className="editor-button">
                        取消
                </Button> : null}
            </Header>
            <Layout className="editor-holder">
                <CodeMirror
                    options={{
                        mode: 'markdown',
                        theme: 'material',
                        lineNumbers: true
                    }}
                    className="editor-codemirror"
                    value={this.tempContent}
                    onChange={this.onEditorTextChange} />
                <ReactMarkdown className="editor-preview" source={this.state.editorContent} />
            </Layout>
        </Layout>;
    }
};