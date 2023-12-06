class NotesHandler { 
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    async postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const { title = 'untitled', tags, body } = request.payload;
            const noteId = await this._service.addNote({ title, tags, body });
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            });
            response.code(400);
            return response;
        }
    }

    async getNotesHandler() {
        const notes = await this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes
            }
        };
    }

    async getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = await this._service.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note
                }
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            });
            response.code(404);
            return response;
        }
    }

    async putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const { id } = request.params;
            await this._service.editNoteById(id, request.payload);
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui'
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            });
            response.code(404);
            return response;
        }
    }

    async deleteNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus'
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan'
            });
            response.code(404);
            return response;
        }
    }
}
module.exports = NotesHandler;