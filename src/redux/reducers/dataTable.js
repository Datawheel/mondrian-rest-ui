const PAGE_SET = 'mondrian/dataTable/PAGE_SET';

const initialState = {
    page: 1
};

export default function reducer(state = initialState, action={}) {
    switch(action.type) {
        case PAGE_SET:
            return {
                ...state,
                page: action.page
            };
        default:
            return state;
    }
}

export function setPage(page) {
    return {
        type: PAGE_SET,
        page: page
    };
}
