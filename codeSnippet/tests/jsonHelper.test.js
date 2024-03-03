

const { clsUtility } = require("./../utils");

const { JsonHelper } = clsUtility;

test("Json Object", () => {

    const obj = {
        "Name": "Brent Luna"
    }
    const rObj = JSON.stringify(obj, null, 4);

    const res = JsonHelper(obj);

    expect(res).toBe(rObj);
});

// Json Object With String
test("Json String", () => {

    const obj = {
        "Name": "Brent Luna"
    }
    const rObj = JSON.stringify(obj, null, 4);

    const txt = "{ \"Name\": \"Brent Luna\" }";
    const res = JsonHelper(txt);

    expect(res).toBe(rObj);
})

// Json Obj With Json String
test("Json Obj With Json String", () => {

    const obj = {
        "data": "{ \"Name\": \"Brent Luna\" }"
    }
    const rObj = JSON.stringify(obj, null, 4);

    const res = JsonHelper(obj);

    expect(res).toBe(rObj);
});

// Json String With Json String
test("Json String With Json String", () => {

    const obj = {
        "data": {
            "Name": "Brent Luna"
        }
    }
    const rObj = JSON.stringify(obj, null, 4);

    const txt = "{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }";
    const res = JsonHelper(txt);

    expect(res).toBe(rObj);
});

test("Json With Array Inside", () => {

    const obj = {
        "data": [ "asdf", "asdf" ]
    }
    const rObj = JSON.stringify(obj, null, 4);

    const res = JsonHelper(obj);

    expect(res).toBe(rObj);
})

test("Json With Json String of Array", () => {

    const obj = {
        "data": [ "asdf", "asdf" ]
    }
    const rObj = JSON.stringify(obj, null, 4);

    const tObj = {
        "data": "\"[ \"asdf\", \"asdf\" ]\""
    }
    const res = JsonHelper(tObj);

    expect(res).toBe(rObj);
});

test("Json String With Json String of Array", () => {

    const obj = {
        "data": [ "asdf", "asdf" ]
    }
    const rObj = JSON.stringify(obj, null, 4);

    const tObj = "{ \"data\": \"[ \"asdf\", \"asdf\" ]\" }"
    const res = JsonHelper(tObj);

    expect(res).toBe(rObj);
});

